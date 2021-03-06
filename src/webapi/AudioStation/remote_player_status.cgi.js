const fs = require('fs')
const library = require('../../../library.js')

module.exports = {
  getPlaybackInformation,
  httpRequest: async (_, res, _2, queryData) => {
    let response
    switch (queryData.method) {
      case 'getstatus':
        response = await getPlaybackInformation()
        break
    }
    if (response.buffer) {
      res.writeHead(206, {
        'content-type': response.contentType,
        'content-length': response.buffer.length
      })
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function getPlaybackInformation () {
  if (!library.remoteQueuePlaying) {
    return {
      data: {
        index: null,
        play_mode: {
          repeat: 'none',
          shuffle: false
        },
        playlist_timestamp: Math.floor(new Date().getTime() / 1000),
        playlist_total: 0,
        position: 0,
        song: null,
        state: 'none',
        stop_index: -1,
        subplayer_volume: null,
        volume: 49
      },
      success: true
    }
  } else {
    let position = 0
    const positionFile = '/tmp/open_audio_server_remote_player_position'
    if (fs.existsSync(positionFile)) {
      let playbackText = fs.readFileSync(positionFile).toString()
      if (playbackText.length && playbackText.indexOf(' 00:0') > -1) {
        playbackText = playbackText.substring(playbackText.lastIndexOf(' 00:0') + 1)
        playbackText = playbackText.substring(0, playbackText.indexOf(' '))
        const parts = playbackText.split(':')
        position += parseInt(parts[0], 10) * 60 * 60
        position += parseInt(parts[1], 10) * 60
        position += Math.floor(parseFloat(parts[2]))
      }
    }
    const song = library.remoteQueue[library.remoteQueueIndex]
    return {
      data: {
        index: library.remoteQueueIndex,
        play_mode: {
          repeat: 'none',
          shuffle: false
        },
        playlist_timestamp: Math.floor(new Date().getTime() / 1000),
        playlist_total: library.remoteQueue.length,
        song,
        state: 'playing',
        stop_index: library.remotePlayerProgress,
        subplayer_volume: null,
        position,
        volume: 49
      },
      success: true
    }
  }
}
