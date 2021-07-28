const library = require('../../../library.js')
const exec = require('child_process').exec
const util = require('util')

module.exports = {
  listPlaybackDevices,
  getQueue,
  updateQueue,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await listPlaybackDevices()
        break
      case 'getplaylist':
        response = await getQueue()
        break
      case 'updateplaylist':
        response = await updateQueue(postData)
        break
      case 'control':
        response = await control(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listPlaybackDevices () {
  const response = {
    data: {
      players: [{
        id: '__SYNO_USB_PLAYER__',
        is_multiple: false,
        name: 'Playback through device audio',
        password_protected: false,
        support_seek: true,
        support_set_volume: true,
        type: 'usb'
      }]
    },
    success: true
  }
  return response
}

async function getQueue () {
  const response = {
    data: {
      current: 0,
      mode: 'normal',
      shuffle: 0,
      songs: library.remoteQueue,
      total: library.remoteQueue.length,
      timestamp: Math.floor(new Date().getTime() / 1000)
    },
    success: true
  }
  return response
}

const control = module.exports.control = util.promisify((options, callback) => {
  if (options.action === 'set_volume') {
    library.remoteVolume = options.volume
    exec(`amixer sset Master ${options.value}%`)
    return { success: true }
  } else if (options.action === 'next') {
    if (library.remoteQueueIndex < library.remoteQueue.length - 1) {
      library.remoteQueueIndex++
    }
  } else if (options.action === 'prev') {
    if (library.remoteQueueIndex > 0) {
      library.remoteQueueIndex--
    }
  } else if (options.action === 'stop') {
    exec('killall -9 play')
    return { success: true }
  }
  if (library.remoteQueueIndex < 0 || !library.remoteQueue.length) {
    return
  }
  const song = library.remoteQueue[library.remoteQueueIndex]
  exec('killall -9 play')
  exec(`play -S "${song.path}" &>/tmp/open_audio_server_remote_player_position`)
  library.remoteQueuePlaying = true
  return callback(null, { success: true })
})

async function updateQueue (options) {
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  if (options.songs === '') {
    library.remoteQueue.length = 0
    return { success: true }
  }
  if (options.containers_json === '[]' && options.songs.startsWith('radio_')) {
    const info = options.songs.substring('radio_'.length).split(' ')
    const path = info.pop()
    const title = info.join(' ')
    library.remoteQueue.length = 0
    library.remoteQueue.push({
      additional: {
        song_audio: {
          bitrate: 0,
          channel: 0,
          codec: '',
          container: '',
          duration: 0,
          filesize: 0,
          frequency: 0
        },
        song_rating: {
          rating: 0
        },
        song_tag: {
          album: '',
          album_artist: '',
          artist: '',
          comment: '',
          composer: '',
          disc: 0,
          genre: '',
          track: 0,
          year: 0
        }
      },
      id: options.songs,
      path,
      title,
      type: 'remote'
    })
    return { success: true }
  }
  if (options.containers_json === '[]' && options.songs) {
    const songs = options.songs.split(',')
    if (options.updated_index) {
      let index = offset
      for (const songid of songs) {
        const song = library.songs.filter(song => song.id === songid)[0]
        library.remoteQueue[index] = song
        index++
      }
    } else {
      for (const songid of songs) {
        const song = library.songs.filter(song => song.id === songid)[0]
        if (offset === 0) {
          library.remoteQueue.unshift(song)
        } else {
          library.remoteQueue.push(song)
        }
      }
    }
  }
  if (options.containers_json && options.containers_json !== '[]') {
    const container = JSON.parse(options.containers_json)[0]
    if (container.type === 'folder') {
      const folder = Object.values(library.folders).filter(folder => folder.id === container.id)[0]
      for (const item of folder.items) {
        if (item.items) {
          for (const song of item.items) {
            if (offset === 0) {
              library.remoteQueue.unshift(song)
            } else {
              library.remoteQueue.push(song)
            }
          }
        } else {
          if (offset === 0) {
            library.remoteQueue.unshift(item)
          } else {
            library.remoteQueue.push(item)
          }
        }
      }
    } else if (container.type === 'album') {
      const filtered = library.songs.filter(song => song.album === container.album)
      for (const song of filtered) {
        if (offset === 0) {
          library.remoteQueue.unshift(song)
        } else {
          library.remoteQueue.push(song)
        }
      }
    } else if (container.type === 'artist') {
      const artist = library.artists.filter(artist => artist.title === container.artist)[0]
      const filtered = library.songs.filter(song => song.artists.indexOf(artist) === 0)
      for (const song of filtered) {
        if (offset === 0) {
          library.remoteQueue.unshift(song)
        } else {
          library.remoteQueue.push(song)
        }
      }
    } else if (container.type === 'composer') {
      const composer = library.composers.filter(composer => composer.title === container.composer)[0]
      const filtered = library.songs.filter(song => song.composers.indexOf(composer) === 0)
      for (const song of filtered) {
        if (offset === 0) {
          library.remoteQueue.unshift(song)
        } else {
          library.remoteQueue.push(song)
        }
      }
    } else if (container.type === 'genre') {
      const genre = library.genres.filter(genre => genre.title === container.genre)[0]
      const filtered = library.songs.filter(song => song.genres.indexOf(genre) === 0)
      for (const song of filtered) {
        if (offset === 0) {
          library.remoteQueue.unshift(song)
        } else {
          library.remoteQueue.push(song)
        }
      }
    } else if (container.type === 'playlist') {
      if (container.id.startsWith('playlist_personal_normal')) {
        const playList = library.playLists.filter(playList => playList.id === container.id)[0]
        for (const song of playList.songs) {
          library.remoteQueue.push(song)
        }
      } else {
        const playList = library.playLists.filter(playList => playList.id === container.id)[0]
        for (const song of library.songs) {
          let matches = 0
          for (const rule of playList.additional.rules) {
            let value
            switch (rule.tag) {
              case 1:
                value = song.artist
                break
              case 2:
                value = song.album
                break
              case 11:
                value = song.artists
                break
              case 12:
                value = song.composers
                break
              case 3:
                value = song.genres
                break
              case 4:
                value = song.path
                break
              case 7:
                value = song.additional.song_tag.year
                break
              case 8:
                value = song.additional.song_audio.bitrate
                break
              case 9:
                value = song.created
                break
              case 13:
                value = song.additional.song_rating.song_rating
                break
            }
            if (!value) {
              continue
            }
            if (value.splice) {
              switch (rule.op) {
                case 1: // "is"
                  if (!value.filter(item => item.name.toString().toLowerCase() === rule.tagval.toLowerCase()).length) {
                    matches++
                  }
                  continue
                case 2: // "is not"
                  if (!value.filter(item => item.name.toString().toLowerCase() === rule.tagval.toLowerCase()).length) {
                    matches++
                  }
                  continue
                case 3: // "contains"
                  if (!value.filter(item => item.name.toString().toLowerCase().indexOf(rule.tagval.toLowerCase()) > -1).length) {
                    matches++
                  }
                  continue
                case 4: // "does not contain"
                  if (!value.filter(item => item.name.toString().toLowerCase().indexOf(rule.tagval.toLowerCase()) > -1).length) {
                    matches++
                  }
                  continue
              }
            } else {
              switch (rule.op) {
                case 1: // "is"
                  if ((value || '').toString().toLowerCase() === rule.tagval.toLowerCase()) {
                    matches++
                  }
                  continue
                case 2: // "is not"
                  if ((value || '').toString().toLowerCase() !== rule.tagval.toLowerCase()) {
                    matches++
                  }
                  continue
                case 3: // "contains"
                  if ((value || '').toString().toLowerCase().indexOf(rule.tagval.toLowerCase()) > -1) {
                    matches++
                  }
                  continue
                case 4: // "does not contain"
                  if ((value || '').toString().toLowerCase().indexOf(rule.tagval.toLowerCase()) === -1) {
                    matches++
                  }
                  continue
                case 256: // greater than
                  if (value > parseInt(rule.tagval, 10)) {
                    matches++
                  }
                  continue
                case 512: // less than
                  if (value < parseInt(rule.tagval, 10)) {
                    matches++
                  }
                  continue
                case 16: // before
                  if (value < Math.floor(Date.parse(rule.tagval).getTime() / 1000)) {
                    matches++
                  }
                  continue
                case 32: // after
                  if (value > Math.floor(Date.parse(rule.tagval).getTime() / 1000)) {
                    matches++
                  }
                  continue
              }
            }
          }
          if (matches === 0) {
            continue
          }
          if (playList.additional.rules_conjunction === 'or' || matches === playList.additional.rules.length) {
            library.remoteQueue.push(song)
          }
        }
      }
      return { success: true }
    }
  }
  return { success: false }
}
