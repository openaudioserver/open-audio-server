const fs = require('fs')
const path = require('path')
const entryCGI1 = fs.readFileSync(path.join(__dirname, 'entry.cgi.1.js')).toString()
const entryCGI2 = fs.readFileSync(path.join(__dirname, 'entry.cgi.2.js')).toString()
const entryCGI3 = fs.readFileSync(path.join(__dirname, 'entry.cgi.3.js')).toString()
const entryCGI4 = fs.readFileSync(path.join(__dirname, 'entry.cgi.4.js')).toString()
const entryCGI5 = JSON.stringify(require('./entry.cgi.5.json'))
const cache = {}
const existsCache = {}

module.exports = (req, res, postData, queryData) => {
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  if (queryData.api === 'SYNO.Core.Desktop.Defs' && queryData.version === '1' && queryData.method === 'getjs') {
    return res.end(entryCGI1)
  } else if (queryData.api === 'SYNO.Core.Desktop.JSUIString' && queryData.version === '1' && queryData.method === 'getjs') {
    return res.end(entryCGI2)
  } else if (queryData.api === 'SYNO.Core.Desktop.SessionData' && queryData.version === '1' && queryData.method === 'getjs') {
    return res.end(entryCGI3)
  } else if (queryData.api === 'SYNO.Core.Desktop.UIString' && queryData.version === '1' && queryData.method === 'getjs') {
    return res.end(entryCGI4)
  } else if (postData.api === 'SYNO.Core.Desktop.Initdata' && postData.launch_app === '"SYNO.SDS.AudioStation.Application"') {
    return res.end(entryCGI5)
  } else if (postData.api === 'SYNO.Core.Desktop.Initdata' && postData.action === '"external_ip"') {
    return res.end('{ "data": { "external_ip": "0.0.0.0" }, "success": true }')
  } else if (postData.api === 'SYNO.Core.Desktop.Timeout') {
    return res.end('{ "data": { "timeout": 15 }, "success": true }')
  } else if (postData.api === 'SYNO.FileStation.BackgroundTask' && postData.method === 'list') {
    return res.end('{ "data": { "offset": 0, "tasks": [], "total": 0 }, "success": true }')
  } else if (postData.api === 'SYNO.Core.DataCollect.Application' && postData.app === '"SYNO.SDS.AudioStation.AppWindow"') {
    return res.end('{ "success": true }')
  } else if (postData.api === 'SYNO.Core.UserSettings' && postData.method === 'apply') {
    return res.end('{ "success": true }')
  } else if (postData.api === 'SYNO.Entry.Request' && postData.mode === '"parallel"') {
    return res.end('{ "data": { "has_fail": false, "result": [{ "api": "SYNO.Core.Desktop.Timeout", "method": "check", "success": true, "version": 1 }] }, "success": true }')
  }
  // AudioStation pinning and playlists routes through this URL
  if (postData.api === 'SYNO.AudioStation.Pin') {
    const pinlist = require('../webapi/AudioStation/pinlist.js')
    return pinlist(req, res, postData, queryData)
  } else if (postData.api === 'SYNO.AudioStation.Browse.Playlist') {
    const playlist = require('../webapi/AudioStation/playlist.cgi.js')
    return playlist(req, res, postData, queryData)
  }
  // map everything else to a synoman file if exists
  let urlPart = req.url.split('?')[0]
  if (queryData.api === 'SYNO.Core.Synohdpack' && queryData.path) {
    urlPart = `/${queryData.path.replace('{0}', '256')}`
  }
  const synomanFilePath = path.join(process.env.SYNOMAN_PATH, urlPart)
  const exists = existsCache[synomanFilePath] = existsCache[synomanFilePath] || fs.existsSync(synomanFilePath)
  if (exists) {
    cache[synomanFilePath] = cache[synomanFilePath] || {
      format: 'image/png',
      data: fs.readFileSync(synomanFilePath)
    }
    res.setHeader('content-type', cache[synomanFilePath].format)
    return res.end(cache[synomanFilePath].data)
  }
}
