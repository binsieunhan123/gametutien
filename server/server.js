import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { MongoClient } from 'mongodb'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const client = new MongoClient(MONGO_URL)
await client.connect()
const collection = client.db('xiuxian').collection('players')

// HTTP APIs (兼容旧版本)
app.get('/player/:key', async (req, res) => {
  const doc = await collection.findOne({ key: req.params.key })
  res.json({ value: doc?.value ?? null })
})

app.post('/player/:key', async (req, res) => {
  await collection.updateOne(
    { key: req.params.key },
    { $set: { value: req.body.value } },
    { upsert: true }
  )
  res.json({ ok: true })
})

app.post('/player/batch', async (req, res) => {
  const ops = (req.body.items || []).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { $set: { value } },
      upsert: true
    }
  }))
  if (ops.length) await collection.bulkWrite(ops)
  res.json({ ok: true })
})

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.on('getData', async (key, cb) => {
    const doc = await collection.findOne({ key })
    cb(doc?.value ?? null)
  })

  socket.on('setData', async ({ key, value }, cb) => {
    await collection.updateOne(
      { key },
      { $set: { value } },
      { upsert: true }
    )
    cb(true)
  })

  socket.on('batchSet', async (items, cb) => {
    const ops = (items || []).map(({ key, value }) => ({
      updateOne: {
        filter: { key },
        update: { $set: { value } },
        upsert: true
      }
    }))
    if (ops.length) await collection.bulkWrite(ops)
    cb(true)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
