import axios from 'axios'
import { AsyncStorage } from 'react-native'
export const HOST_URL = 'http://192.168.1.114:8000'
export const API_BASE = `${HOST_URL}/api/v1`

const axiosAuthInstance = () => {
  return AsyncStorage.getItem('jwt')
    .then((token) => {
      return axios.create({
        baseURL: API_BASE,
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      })
    })
}

export default {
  createUser: (userData) => {
    return axios.post(`${API_BASE}/user/`, userData)
  },
  login: (email, password) => {
    return axios.post(`${API_BASE}/user/login/`, { email, password })
  },
  getUsers: () => {
    return axiosAuthInstance()
      .then((axiosApi) =>
        axiosApi.get('/user/')
      )
  },
  createDevice: (name) => {
    console.log('dss')
    return axiosAuthInstance()
      .then((axiosApi) =>
        axiosApi.post('/dispositivo/', { nombre: name })
      )
  }
}
