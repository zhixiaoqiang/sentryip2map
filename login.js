module.exports = async (page) => {
  const navigationPromise = page.waitForNavigation()
  const userInfo = {
    userName: 'xxx',
    pwd: 'xxx',
  }

  await page.goto('http://sentry.xx.xx/auth/login/sentry/')

  await navigationPromise

  const pageProps = await page.evaluate(() => {
    const screenW = window.outerWidth
    const screenH = window.innerHeight
    return {
      screenW,
      screenH,
    }
  })

  await page.setViewport({
    width: pageProps.screenW,
    height: pageProps.screenH,
  })

  await page.waitForSelector('#login > .form-stacked > #div_id_username > .controls > #id_username')
  await page.type(
    '#login > .form-stacked > #div_id_username > .controls > #id_username',
    userInfo.userName,
    { delay: 50 }
  )

  await page.waitForSelector('#login > .form-stacked > #div_id_password > .controls > #id_password')
  await page.type(
    '#login > .form-stacked > #div_id_password > .controls > #id_password',
    userInfo.pwd,
    { delay: 50 }
  )

  await page.waitForSelector('.tab-content > #login > .form-stacked > .form-actions > .btn')
  await page.click('.tab-content > #login > .form-stacked > .form-actions > .btn')

  await navigationPromise
}
