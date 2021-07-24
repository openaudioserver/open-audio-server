const fs = require('fs')
const path = require('path')
const entryCGI1 = fs.readFileSync(path.join(__dirname, 'entry.cgi.1.js')).toString()
const entryCGI2 = fs.readFileSync(path.join(__dirname, 'entry.cgi.2.js')).toString()
const entryCGI3 = fs.readFileSync(path.join(__dirname, 'entry.cgi.3.js')).toString()
const entryCGI4 = fs.readFileSync(path.join(__dirname, 'entry.cgi.4.js')).toString()
const entryCGI5 = require('./entry.cgi.5.json')
const statCache = {}

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
    return res.end(JSON.stringify(entryCGI5))
  } else if (postData.api === 'SYNO.Core.Desktop.Initdata' && postData.action === '"external_ip"') {
    return res.end(JSON.stringify({ data: { external_ip: '0.0.0.0' }, success: true }))
  } else if (postData.api === 'SYNO.Core.Desktop.Timeout') {
    return res.end(JSON.stringify({ data: { timeout: 15 }, success: true }))
  } else if (postData.api === 'SYNO.FileStation.BackgroundTask' && postData.method === 'list') {
    return res.end(JSON.stringify({ data: { offset: 0, tasks: [], total: 0 }, success: true }))
  } else if (postData.api === 'SYNO.Core.DataCollect.Application' && postData.app === '"SYNO.SDS.AudioStation.AppWindow"') {
    return res.end(JSON.stringify({ success: true }))
  } else if (postData.api === 'SYNO.Core.UserSettings' && postData.method === 'apply') {
    return res.end(JSON.stringify({ success: true }))
  } else if (postData.api === 'SYNO.Entry.Request' && postData.mode === '"parallel"') {
    return res.end(JSON.stringify({ data: { has_fail: false, result: [{ api: 'SYNO.Core.Desktop.Timeout', method: 'check', success: true, version: 1 }] }, success: true }))
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
  const synomanFilePath = path.join(__dirname, 'synoman', urlPart)
  if (fs.existsSync(synomanFilePath)) {
    const stat = statCache[synomanFilePath] = statCache[synomanFilePath] || fs.statSync(synomanFilePath)
    if (!stat.isDirectory()) {
      if (urlPart.endsWith('.html')) {
        res.setHeader('content-type', 'text/html')
      } else if (urlPart.endsWith('.css')) {
        res.setHeader('content-type', 'text/css')
      } else if (urlPart.endsWith('.png')) {
        res.setHeader('content-type', 'image/png')
      } else if (urlPart.endsWith('.js')) {
        res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
      }
      const buffer = fs.readFileSync(synomanFilePath)
      return res.end(buffer)
    }
  }
}
