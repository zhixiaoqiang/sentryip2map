const puppeteer = require('puppeteer')

const login = require('./login.js')
const getUserIp = require('./getUserIp.js')
// const getLocationList = require('./getLocationList.js')
// const ipList = require('./data/ipList.json')
const dingTalk = require('./dingTalk')

;(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  const navigationPromise = page.waitForNavigation()
  await dingTalk({ text: '准备登录sentry' })
  await login(page)

  await page.goto('http://sentry.xx.xx/sentry/xds/issues/7315/tags/user/')

  // 方案一：
  // 导出csv => json => 第三方api获取到location
  // 最多只能导出205条数据，原因未知

  // await page.waitForSelector('.content > div > div > h3 > .btn')
  // await page.click('.content > div > div > h3 > .btn')
  // const ipList = await getUserIp.csv(page)
  // await getLocationList(ipList)

  await navigationPromise

  // 方案二：
  // 爬取页面内容
  await dingTalk({ text: '开始爬取用户ip' })
  const ipList = await getUserIp.puppeteer(page)
  await dingTalk({ text: '爬取结束' })
  // await getLocationList(ipList)

  // await browser.close()
})()
