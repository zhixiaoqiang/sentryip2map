const fse = require('fs-extra')
const csv = require('csvtojson')

module.exports.puppeteer = async page => {
  const navigationPromise = page.waitForNavigation()
  let totalIps = []
  let isComplete = true

  await page.waitForSelector('table tr')
  await page.waitForSelector('.stream-pagination > .btn-group > .next')

  const pageProps = await page.evaluate(() => {
    const dom = [
      ...document.querySelectorAll('table tr > td > a > span:nth-child(2)'),
    ]

    const isComplete = !!document.querySelector(
      'div > div > .stream-pagination > .btn-group > .next.disabled'
    )

    const ipList = dom.map(node => {
      return {
        ip: node.innerText,
      }
    })

    return {
      isComplete,
      ipList,
    }
  })

  totalIps = [...totalIps, ...pageProps.ipList]
  isComplete = pageProps.isComplete
  while (!isComplete) {
    await page.click('div > div > .stream-pagination > .btn-group > .next')

    await navigationPromise
    await page.waitForSelector('table tr')
    await page.waitForSelector('.stream-pagination > .btn-group > .next')

    const pageProps = await page.evaluate(() => {
      const dom = [
        ...document.querySelectorAll('table tr > td > a > span:nth-child(2)'),
      ]

      const isComplete = !!document.querySelector(
        'div > div > .stream-pagination > .btn-group > .next.disabled'
      )

      const ipList = dom.map(node => {
        return {
          ip: node.innerText,
        }
      })

      return {
        isComplete,
        ipList,
      }
    })

    totalIps = [...totalIps, ...pageProps.ipList]
    isComplete = pageProps.isComplete
    if (isComplete) {
      try {
        await fse.writeJson('./ipList.json', totalIps)
        console.log(`已获取全部ip! 共${totalIps.length}个`)
      } catch (err) {
        console.error(err)
      }
    }
  }
}

module.exports.csv = async function getIplist(csvPath) {
  const csvPath = '/Users/zl/Downloads/XDS-DD-user.csv'
  const data = await csv().fromFile(csvPath)
  return data.map(obj => {
    const { ip_address } = obj
    return {
      ip: ip_address,
    }
  })
}
