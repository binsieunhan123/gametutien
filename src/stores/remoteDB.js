import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const socket = io(API_URL)

export class RemoteDB {
  static async getData (key) {
    return new Promise(resolve => {
      socket.emit('getData', key, value => {
        resolve(value)
      })
    })
  }

  static async setData (key, value) {
    return new Promise(resolve => {
      socket.emit('setData', { key, value }, () => resolve())
    })
  }

  static async batchSet (items) {
    return new Promise(resolve => {
      socket.emit('batchSet', items, () => resolve())
    })
  }
}
