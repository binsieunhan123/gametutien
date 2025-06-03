import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const socket = io(API_URL)

let username = localStorage.getItem('username') || ''
export function setUsername (name) {
  username = name
  localStorage.setItem('username', name)
}

export function remoteLogin (name, password) {
  return new Promise((resolve, reject) => {
    socket.emit('login', { username: name, password }, res => {
      if (res?.ok) {
        resolve(true)
      } else {
        reject(new Error(res?.error || 'Đăng nhập thất bại'))
      }
    })
  })
}

export function remoteRegister (name, password) {
  return new Promise((resolve, reject) => {
    socket.emit('register', { username: name, password }, res => {
      if (res?.ok) {
        resolve(true)
      } else {
        reject(new Error(res?.error || 'Đăng ký thất bại'))
      }
    })
  })
}

export class RemoteDB {
  static async getData (key) {
    return new Promise(resolve => {
      socket.emit('getData', { username, key }, value => resolve(value))
    })
  }

  static async setData (key, value) {
    return new Promise(resolve => {
      socket.emit('setData', { username, key, value }, () => resolve())
    })
  }

  static async batchSet (items) {
    return new Promise(resolve => {
      socket.emit('batchSet', { username, items }, () => resolve())
    })
  }
}
