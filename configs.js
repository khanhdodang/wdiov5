const user = process.env.user || 'khanhdo'
const key = process.env.key || ''
const hostname = process.env.hostname || 'api.kobiton.com'
const deviceName = process.env.deviceName || '*'
const loopCount = process.env.RUN_LOOP || 1000

exports.username = user
exports.key = key
exports.apiUrl = `https://${hostname}`
exports.loopCount = loopCount

exports.desiredCaps = {
  logLevel: 'error',
  capabilities: {
    browserName: 'chrome',
    deviceName,
    platformName: 'Android',
    deviceGroup: 'KOBITON',
    newCommandTimeout: 120
  },
  protocol: 'https',
  hostname,
  user,
  key
}


