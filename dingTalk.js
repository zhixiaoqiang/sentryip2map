const rp = require('request-promise')
const dingtalkUrl =
  'https://oapi.dingtalk.com/robot/send?access_token=17951140a6f17d2ee10b0af05affd49a587d060ea693029dd2bcaeb7d1ac53b8'

async function sendInfo ({ text, mobile = '15057594294', isAtAll }) {
  const body = {
    msgtype: 'text',
    text: {
      content: `${text} @${mobile}`,
    },
    at: {
      atMobiles: [mobile],
      isAtAll: false,
    },
  }

  try {
    const result = await rp({
      uri: dingtalkUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      json: true,
    })
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

module.exports = sendInfo
