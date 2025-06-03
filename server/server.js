import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import { createHash } from 'crypto'

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const client = new MongoClient(MONGO_URL)
await client.connect()
const db = client.db('xiuxian')
const players = db.collection('players')
const users = db.collection('users')

function hash (str) {
  return createHash('sha256').update(str).digest('hex')
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Thiếu thông tin' })
  const exist = await users.findOne({ username })
  if (exist) return res.status(400).json({ error: 'Tên đã tồn tại' })
  await users.insertOne({ username, password: hash(password) })
  res.json({ ok: true })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await users.findOne({ username })
  if (!user || user.password !== hash(password)) {
    return res.status(400).json({ error: 'Sai tài khoản hoặc mật khẩu' })
  }
  res.json({ ok: true })
})

// HTTP APIs giữ tương thích
app.get('/player/:username/:key', async (req, res) => {
  const doc = await players.findOne({ username: req.params.username, key: req.params.key })
  res.json({ value: doc?.value ?? null })
})

app.post('/player/:username/:key', async (req, res) => {
  await players.updateOne(
    { username: req.params.username, key: req.params.key },
    { $set: { value: req.body.value } },
    { upsert: true }
  )
  res.json({ ok: true })
})

app.post('/player/:username/batch', async (req, res) => {
  const ops = (req.body.items || []).map(({ key, value }) => ({
    updateOne: {
      filter: { username: req.params.username, key },
      update: { $set: { value } },
      upsert: true
    }
  }))
  if (ops.length) await players.bulkWrite(ops)
  res.json({ ok: true })
})

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.on('login', async ({ username, password }, cb) => {
    const user = await users.findOne({ username })
    if (!user || user.password !== hash(password)) {
      return cb({ ok: false, error: 'Sai tài khoản hoặc mật khẩu' })
    }
    cb({ ok: true })
  })

  socket.on('register', async ({ username, password }, cb) => {
    const exist = await users.findOne({ username })
    if (exist) return cb({ ok: false, error: 'Tên đã tồn tại' })
    await users.insertOne({ username, password: hash(password) })
    cb({ ok: true })
  })

  socket.on('getData', async ({ username, key }, cb) => {
    const doc = await players.findOne({ username, key })
    cb(doc?.value ?? null)
  })

  socket.on('setData', async ({ username, key, value }, cb) => {
    await players.updateOne(
      { username, key },
      { $set: { value } },
      { upsert: true }
    )
    cb(true)
  })

  socket.on('batchSet', async ({ username, items }, cb) => {
    const ops = (items || []).map(({ key, value }) => ({
      updateOne: {
        filter: { username, key },
        update: { $set: { value } },
        upsert: true
      }
    }))
    if (ops.length) await players.bulkWrite(ops)
    cb(true)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
