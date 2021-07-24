const AudioStationInfoCGI1 = require('./info.cgi.1.json')
const AudioStationInfoCGI2 = require('./info.cgi.2.json')
const AudioStationInfoCGI3 = require('./info.cgi.3.json')

module.exports = (_, res, postData) => {
  if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '1') {
    res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
    return res.end(JSON.stringify(AudioStationInfoCGI1))
  } else if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '2') {
    res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
    return res.end(JSON.stringify(AudioStationInfoCGI2))
  } else if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '4') {
    res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
    return res.end(JSON.stringify(AudioStationInfoCGI3))
  }
}
