const fse = require('fs-extra')
const rp = require('request-promise')

const PAGE_SIZE = 200

async function getLocation ({ ip }) {
  const result = await rp({
    uri: `http://api.ipstack.com/${ip}`,
    qs: {
      access_key: 'xxx',
      fields: 'region_name,city,latitude,longitude,ip',
      language: 'zh',
      output: 'json',
    },
    json: true,
  })
  return result
}

async function getLocationList (ipList) {
  const promises = ipList.map(getLocation)
  let locationList = []
  try {
    locationList = await Promise.all(promises)
  } catch (err) {
    console.error(err)
  }

  try {
    const curLocationsList = []
    try {
      curLocationsList = await fse.readJSON('./locationList.json', 'utf8')
    } catch (error) {}

    await fse.outputJson('./locationList.json', [
      ...curLocationsList,
      ...locationList,
    ])
    console.log('已将ip全部转换为location!')
  } catch (err) {
    console.error(err)
  }
}

// ;(async () => {
//   try {
//     let curLocationsList = []
//     try {
//       curLocationsList = await fse.readFile('./data/points.js', 'utf8')
//       console.log(curLocationsList)
//     } catch (error) {
//       console.log(error)
//     }
//   } catch (err) {
//     console.error(err)
//   }
// })()

// 由于一次最多只能并发200条，所以拆开来请求
module.exports = async function (ipList) {
  const length = ipList.length / PAGE_SIZE
  const mapArr = Array.from({ length }, (v, i) => i)

  const promises = mapArr.map(async val => await getLocationList(ipList.slice(val, val + PAGE_SIZE)))

  try {
    await Promise.all(promises)
    console.log('已将ip全部转换为location!')
    // try {
    //   const locationList = []
    //   const pointsJs = ''
    //   try {
    //     locationList = await fse.readJSON('./data/locationList.json', 'utf8')
    //     pointsJs = await fse
    //       .readJSON('./data/points.json', 'utf8')
    //       .replace(/(= )(\[.*\])/, (match, p1, p2) => p1 + locationList)
    //   } catch (error) {}

    //   await fse.outputFile('./data/points.js', pointsJs)
    //   console.log('已将ip全部转换为location!')
    // } catch (err) {
    //   console.error(err)
    // }
  } catch (err) {
    console.error(err)
  }
}
