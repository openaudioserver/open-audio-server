const http = require('http')
const https = require('https')
const iceCast = require('icecast-parser')
const library = require('../../../library.js')

module.exports = (req, res, postData, queryData) => {
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  if (queryData.method === 'getsonginfo') {
    const streamid = queryData.stream_id
    const url = library.radioStreams[streamid].newURL
    const station = new iceCast.Parser({ url, autoUpdate: false })
    return station.on('metadata', (metaData) => {
      if (metaData) {
        return res.end(JSON.stringify({ data: { title: metaData.get('StreamTitle') }, success: true }))
      } else {
        return res.end(JSON.stringify({ data: { title: '' }, success: true }))
      }
    })
  } else if (queryData.method === 'stream') {
    const stream = library.radioStreams[queryData.stream_id].stream
    return stream.pipe(res)
  } else if (postData.method === 'deletesonginfo') {
    if (library.radioStreams[postData.stream_id]) {
      if (library.radioStreams[postData.stream_id].end) {
        library.radioStreams[postData.stream_id].end()
      }
      delete (library.radioStreams[postData.stream_id])
    }
  } else if (postData.method === 'getstreamid') {
    const streamid = 'stream' + Math.floor(Math.random() * 1000000000)
    const url = postData.id.split(' ').pop()
    const protocol = url.startsWith('https') ? https : http
    const request = protocol.get(url, (response) => {
      response.on('error', (error) => {
        console.log('proxy.cgi error 1', error)
      })
      response.on('data', data => {
        const playlist = data.toString().split('\n')
        const urls = []
        for (const line of playlist) {
          if (!line.startsWith('File')) {
            continue
          }
          urls.push(line.substring(line.indexOf('=') + 1))
        }
        const newURL = urls.pop()
        if (!newURL) {
          return res.end('{"success": false}')
        }
        const protocol = newURL.startsWith('https') ? https : http
        protocol.get(newURL, (stream) => {
          library.radioStreams[streamid] = {
            stream,
            url,
            newURL,
            streamid
          }
          return res.end(JSON.stringify({
            data: {
              format: 'mp3',
              stream_id: streamid
            },
            success: true
          }))
        }).on('error', (error) => {
          console.log('proxy.cgi error 2', error)
        }).on('end', () => {
          delete (library.radioStreams[streamid])
        }).end()
      })
    })
    return request.end()
  }
}
