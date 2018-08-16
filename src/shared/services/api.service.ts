import axios from 'axios'
import ENV from '@/environment/index'

// Default interceptor public
export const api = axios.create({
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Add a response interceptor
api.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})

// Default interceptor private
export const api_ipfs = axios.create({
  baseURL: ENV.API.PATH_IPFS,
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Add a response interceptor
api_ipfs.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error)
})


// Default interceptor private
export const api_serve = axios.create({
  baseURL: ENV.API.PATH,
  timeout: 50000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Add a response interceptor
api_ipfs.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error)
})
