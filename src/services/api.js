import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api/v1',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000/api/v1',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  get(url, config) {
    console.log(`%cGET %c${url}`, 'color: cyan;', 'color: lightgreen;')
    return this.api.get(url, config)
  }

  post(url, data, config) {
    console.log(`%cPOST %c${url}`, 'color: teal;', 'color: lightgreen;')
    return this.api.post(url, data, config)
  }

  put(url, data, config) {
    console.log(`%cPUT %c${url}`, 'color: gold;', 'color: lightgreen;')
    return this.api.put(url, data, config)
  }

  delete(url, config) {
    console.log(`%cDELETE %c${url}`, 'color: red;', 'color: lightgreen;')
    return this.api.delete(url, config)
  }
}



// api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// api.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';

export default new Api()
