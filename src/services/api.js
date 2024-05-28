import axios from 'axios'

export const PORT = import.meta.env['API_PORT'] || 8000
export const HOST = `http://${window.location.hostname}:${PORT}`
// export const HOST = 'https://npmqbzfq-8000.brs.devtunnels.ms'
export const URL = `${HOST}/api/v1`


const OPTS = {
  log: true,
  respuesta: true,
  respuestaData: true,
  colors: {
    get: 'cyan',
    post: 'teal',
    put: 'gold',
    delete: 'red',
    url: 'lightgreen'
  }
}

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async mostrarRespuesta(method, url, promise) {
    let log = console.log
    let obj = null

    try {
      obj = await promise
    } catch (error) {
      log = console.error
      obj = error
    }

    if (OPTS.log) {
      const out = []
      out.push(`%c${method.toUpperCase()} %c${url}`)
      out.push(`color: ${OPTS.colors[method]};`)
      out.push(`color: ${OPTS.colors['url']};`)
      if (OPTS.respuesta) {
        if (OPTS.respuestaData) {
          if (obj.data) {
            out.push(obj.data)
          } else {
            out.push(obj)
          }
        } else {
          out.push(obj)
        }
      }
      log(...out)
    }
  }

  get(url, config) {
    const promise = this.api.get(url, config)
    this.mostrarRespuesta('get', url, promise)
    return promise
  }


  post(url, data, config) {
    const promise = this.api.post(url, data, config)
    this.mostrarRespuesta('post', url, promise)
    return promise
  }

  put(url, data, config) {
    const promise = this.api.put(url, data, config)
    this.mostrarRespuesta('put', url, promise)
    return promise
  }

  delete(url, config) {
    const promise = this.api.delete(url, config)
    this.mostrarRespuesta('delete', url, promise)
    return promise
  }
}



// api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// api.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';

export default new Api()
