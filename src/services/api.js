import axios from 'axios'


const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// api.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';

export default api
