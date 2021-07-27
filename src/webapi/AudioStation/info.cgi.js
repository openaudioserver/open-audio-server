const AudioStationInfoCGI1 = JSON.stringify(require('./info.cgi.1.json'))
const AudioStationInfoCGI2 = JSON.stringify(require('./info.cgi.2.json'))
const AudioStationInfoCGI3 = JSON.stringify(require('./info.cgi.3.json'))

module.exports = (_, res, postData) => {
  if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '1') {
    res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
    return res.end(AudioStationInfoCGI1)
  } else if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '2') {
    res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
    return res.end(AudioStationInfoCGI2)
  } else if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '4') {
    res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
    return res.end(AudioStationInfoCGI3)
  }
}
