const http = require('http')
const https = require('https')
const iceCast = require('icecast-parser')
const library = require('../../../library.js')
const util = require('util')
let streamNumber = 0

module.exports = {
  deleteStream,
  httpRequest: async (_, res, postData, queryData) => {
    let response
    if (queryData.method === 'getsonginfo') {
      response = getStreamTrackInformation(queryData)
    } else {
      switch (postData.method) {
        case 'getstreamid':
          response = await startStream()
          break
        case 'deletesonginfo':
          response = await deleteStream(postData)
          break
        case 'stream':
          if (library.radioStreams[queryData.stream_id]) {
            return library.radioStreams[queryData.stream_id].stream.pipe(res)
          }
          break
      }
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

const getStreamTrackInformation = module.exports.getStreamTrackInformation = util.promisify((options, callback) => {
  const url = library.radioStreams[options.stream_id].newURL
  const station = new iceCast.Parser({ url, autoUpdate: false })
  return station.on('metadata', (metaData) => {
    const response = {
      data: {
      },
      success: true
    }
    if (metaData) {
      response.data.title = metaData.get('StreamTitle')
    } else {
      response.data.title = ''
    }
    return callback(null, response)
  })
})

const startStream = module.exports.startStream = util.promisify((options, callback) => {
  streamNumber++
  const streamid = 'stream' + streamNumber
  const url = options.id.split(' ').pop()
  const protocol = url.startsWith('https') ? https : http
  return protocol.get(url, (response) => {
    response.on('error', (error) => {
      console.log('proxy.cgi error 1', error)
      return callback(error)
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
        return callback(null, { success: false })
      }
      const protocol = newURL.startsWith('https') ? https : http
      protocol.get(newURL, (stream) => {
        library.radioStreams[streamid] = {
          stream,
          url,
          newURL,
          streamid
        }
        return callback(null, {
          data: {
            format: 'mp3',
            stream_id: streamid
          },
          success: true
        })
      }).on('error', (error) => {
        console.log('proxy.cgi error 2', error)
        return callback(error)
      }).on('end', () => {
        delete (library.radioStreams[streamid])
      }).end()
    })
  })
})

async function deleteStream (options) {
  if (library.radioStreams[options.stream_id]) {
    if (library.radioStreams[options.stream_id].end) {
      library.radioStreams[options.stream_id].end()
    }
    delete (library.radioStreams[options.stream_id])
  }
  return { success: true }
}
