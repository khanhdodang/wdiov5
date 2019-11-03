import 'babel-polyfill'
import request from 'request'
import BPromise from 'bluebird'
import configs from '../configs'
const requestAsync = BPromise.promisify(request, { multiArgs: true })
class API {
  getToken() {
    return new Buffer.from(`${configs.username}:${configs.key}`)
      .toString('base64')
  }
  setBaseUrl(url) {
    this._baseUrl = removeSlash(url)
  }
  removeSlash(text) {
    return (text) ? text.replace(/\/$/, '') : text
  }
  _getAbsoluteUrl(path) {
    const pageUrl = this._baseUrl ? this._baseUrl : configs.apiUrl
    return `${pageUrl}/v1/${this.removeSlash(path)}`
  }
  async _send({ method = 'GET', json = true, url, path, headers, body = {} } = {}) {
    const finalHeaders = headers || {
      'authorization': `Basic ${this.getToken()}`,
      'content-type': 'application/json'
    }
    const requestURL = url || this._getAbsoluteUrl(path)
    const finalOptions = {
      method,
      json,
      url: requestURL,
      headers: finalHeaders,
      body
    }
    const [response, resBody] = await requestAsync(finalOptions)
    return [resBody, response]
  }
  async get(options = {}) {
    return await this._send({
      ...options,
      method: 'GET'
    })
  }
  async post(options = {}) {
    return await this._send({
      ...options,
      method: 'POST'
    })
  }
  async put(options = {}) {
    return await this._send({
      method: 'PUT',
      ...options
    })
  }
  async delete(options = {}) {
    return await this._send({
      method: 'DELETE',
      ...options
    })
  }
}
export default API
