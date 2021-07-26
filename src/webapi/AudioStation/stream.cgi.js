const fs = require('fs')
const library = require('../../../library.js')

module.exports = (_, res, queryData, postData) => {
  if (postData.method === 'transcode') {
    const song = library.songs.filter(song => song.id === postData.id || queryData.id)[0]
    res.writeHead(206, {
      'content-type': song.path.endsWith('.flac') ? 'audio/flac' : 'audio/mpeg',
      'content-length': song.additional.song_audio.filesize
    })
    const buffer = fs.readFileSync(song.path)
    return res.end(buffer)
  } else {
    const song = library.songs.filter(song => song.id === postData.id || queryData.id)[0]
    res.writeHead(206, {
      'content-type': song.path.endsWith('.flac') ? 'audio/flac' : 'audio/mpeg',
      'content-length': song.additional.song_audio.filesize
    })
    const buffer = fs.readFileSync(song.path)
    return res.end(buffer)
  }
}
