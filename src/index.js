import 'babel-polyfill'
import BPromise from 'bluebird'
import API from './api'
import Device from './device'
import { remote } from 'webdriverio'
import { assert } from 'chai'
import configs from '../configs'

describe('hooks - wait for Kobiton device available for next retry', async () => {

  let devicesList
  let browser
  const filter = { onlineDeviceOnly: true, groupType: 'cloud', deviceName: configs.deviceName }
  const loopCount = configs.loopCount
  
  let itIdx = 0

  before(async () => {
    const api = new API()
    const token = api.getToken()
  })

  after(async () => {
    console.log(`  Finished - ${new Date().toString()}`)
  })

  beforeEach(async () => {
    itIdx++
    const device = new Device()
    devicesList = await device.getDevices(filter)

    let continuePollingCheck = true
    const pollingStartedAt = new Date()
    const TIMEOUT = 10 * 60 * 1000

    do {
      try {
        browser = await remote(configs.desiredCaps)
        continuePollingCheck = false

      } catch (error) {
        console.log(`Device is busy!!! Retrying...`)
        let attemptDuration = new Date() - pollingStartedAt
        if (attemptDuration > TIMEOUT) {
          throw new Error('No device matching the desired capabilities')
        }
      }

      BPromise.delay(10000)
    } while (continuePollingCheck)

  })

  afterEach(async () => {
    console.log(`[${itIdx}/${loopCount}] Ended - ${new Date().toString()}`)
  })

  for (let i = 0; i < loopCount; i++) {
    it(`my test at ${itIdx}`, async () => {
      try {
        const sessionInfo = await browser.getSession()
        const kobitonSessionId = sessionInfo.kobitonSessionId
        console.log(`${configs.portalUrl}/sessions/${sessionInfo.kobitonSessionId}`)

        await browser.url('https://duckduckgo.com/')
        await browser.getUrl()

        const inputElem = await browser.$('#search_form_input_homepage')
        await inputElem.setValue('WebdriverIO')

        const submitBtn = await browser.$('#search_button_homepage')
        await submitBtn.click()

        await browser.getTitle()
      } catch (error) {
        browser && await browser.deleteSession()
      } finally {
        browser && await browser.deleteSession()
      }
    })
  }

})
