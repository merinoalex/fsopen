import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const req = axios.get(baseUrl)
  return req.then(res => res.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.post(baseUrl, newObject, config)
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, setToken }