import BPromise from 'bluebird'
import moment from 'moment'
import API from './api'

class Device extends API {

  /**
   * Retrieve devices in 3 groups: private/org, favorite and cloud devices.
   */
  async _getDevices() {
    const [devicesGroups] = await this.get({
      path: 'devices'
    })
    return devicesGroups
  }

  /**
   * Filter devices by some criteria
   * @param groupType {string} - Private | Cloud | Favorite | All
   * @param platformName {string} - Android | iOS
   * @param platformVersion {string} - Platform Version
   * @param deviceName {string} - Device Name
   */
  async _getDevicesBy({
    onlineDeviceOnly,
    groupType = 'all',
    platformName,
    platformVersion,
    deviceName
  } = {}) {
    const devicesGroups = await this._getDevices()

    console.log('devicesGroups', devicesGroups)

    let devices
    switch (groupType.toLowerCase()) {
    case 'private':
      devices = devicesGroups.privateDevices.sort((a, b) => a.id - b.id)
      break
    case 'cloud':
      devices = devicesGroups.cloudDevices
      break
    case 'favorite':
      devices = devicesGroups.favoriteDevices
      break
    default:
      devices = devicesGroups.cloudDevices.concat(devicesGroups.privateDevices)
      break
    }

    devices = devices.filter((d) => !d.support.appiumDisabled)

    if (platformName) {
      platformName = platformName.toLowerCase()
      devices = devices.filter((d) => d.platformName.toLowerCase() === platformName)
    }

    if (onlineDeviceOnly) {
      devices = devices.filter((d) => d.isOnline && !d.isBooked)
    }

    if (platformVersion) {
      devices = devices.filter((d) => d.platformVersion.includes(platformVersion))
    }

    if (deviceName) {
      deviceName = deviceName.toLowerCase()
      devices = devices.filter((d) => d.deviceName.toLowerCase().includes(deviceName))
    }
    return devices
  }

  /**
   * Return the list of Online devices
   * @param groupType {string} - Private | Cloud | Favorite | All
   * @param platformName {string} - Android | iOS
   * @param platformVersion {string} - Platform Version
   * @param deviceName {string} - Device Name
   */
  async getDevices({
    groupType = 'Cloud',
    platformName,
    platformVersion,
    deviceName,
    onlineDeviceOnly = true
  } = {}) {
    return await this._getDevicesBy({
      onlineDeviceOnly,
      groupType,
      platformName,
      platformVersion,
      deviceName
    })
  }
}

export default Device
