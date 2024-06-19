import axios from 'axios'
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 1000 * 60
})

instance.interceptors.request.use(
  (config) => {
    // config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {}
)

instance.interceptors.response.use(async (res) => {
  return res
})
export default instance
