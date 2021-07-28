const fs = require('fs')
const library = require('../../../library.js')

module.exports = {
  streamFile,
  transcodeMP3,
  httpRequest: async (_, res, _2, queryData) => {
    let response
    switch (queryData.method) {
      case 'stream':
        response = await streamFile(queryData)
        break
      case 'transcode':
        response = await transcodeMP3(queryData)
        break
    }
    if (response.buffer) {
      res.writeHead(206, {
        'content-type': response.contentType,
        'content-length': response.buffer.length
      })
      return res.end(response.buffer)
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function transcodeMP3 (options) {
  return streamFile(options)
}

async function streamFile (options) {
  const song = library.songs.filter(song => song.id === options.id)[0]
  const contentType = song.path.endsWith('.flac') ? 'audio/flac' : 'audio/mpeg'
  const buffer = fs.readFileSync(song.path)
  return { buffer, contentType }
}
