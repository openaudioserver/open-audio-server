const library = require('../../../library.js')

module.exports = {
  getQueue,
  updateQueue,
  httpRequest: async (req, res, postData) => {
    let response
    switch (postData.method) {
      case 'getplaylist':
        response = await getQueue()
        break
      case 'updateplaylist':
        response = await updateQueue(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function getQueue () {
  const response = {
    data: {
      current: 0,
      mode: 'normal',
      shuffle: 0,
      songs: library.playingQueue,
      total: library.playingQueue.length,
      timestamp: Math.floor(new Date().getTime() / 1000)
    },
    success: true
  }
  return response
}

async function updateQueue (options) {
  if (options.songs === '') {
    library.playingQueue.length = 0
    return { success: true }
  }
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  if (options.containers_json === '[]' && options.songs.startsWith('radio_')) {
    const info = options.songs.substring('radio_'.length).split(' ')
    const path = info.pop()
    const title = info.join(' ')
    library.playingQueue.length = 0
    library.playingQueue.push({
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
        library.playingQueue[index] = song
        index++
      }
    } else {
      for (const songid of songs) {
        const song = library.songs.filter(song => song.id === songid)[0]
        if (offset === 0) {
          library.playingQueue.unshift(song)
        } else {
          library.playingQueue.push(song)
        }
      }
    }
    return { success: true }
  }
  if (options.containers_json && options.containers_json !== '[]') {
    const container = JSON.parse(options.containers_json)[0]
    if (container.type === 'folder') {
      const folder = Object.values(library.folders).filter(folder => folder.id === container.id)[0]
      for (const item of folder.items) {
        if (item.items) {
          for (const song of item.items) {
            if (offset === 0) {
              library.playingQueue.unshift(song)
            } else {
              library.playingQueue.push(song)
            }
          }
        } else {
          if (offset === 0) {
            library.playingQueue.unshift(item)
          } else {
            library.playingQueue.push(item)
          }
        }
      }
      return { success: true }
    }
    if (container.type === 'album') {
      const filtered = library.songs.filter(song => song.album === container.album)
      for (const song of filtered) {
        if (offset === 0) {
          library.playingQueue.unshift(song)
        } else {
          library.playingQueue.push(song)
        }
      }
      return { success: true }
    }
    if (container.type === 'artist') {
      const artist = library.artists.filter(artist => artist.title === container.artist)[0]
      const filtered = library.songs.filter(song => song.artists.indexOf(artist) === 0)
      for (const song of filtered) {
        if (offset === 0) {
          library.playingQueue.unshift(song)
        } else {
          library.playingQueue.push(song)
        }
      }
      return { success: true }
    }
    if (container.type === 'composer') {
      const composer = library.composers.filter(composer => composer.title === container.composer)[0]
      const filtered = library.songs.filter(song => song.composers.indexOf(composer) === 0)
      for (const song of filtered) {
        if (offset === 0) {
          library.playingQueue.unshift(song)
        } else {
          library.playingQueue.push(song)
        }
      }
      return { success: true }
    }
    if (container.type === 'genre') {
      const genre = library.genres.filter(genre => genre.title === container.genre)[0]
      const filtered = library.songs.filter(song => song.genres.indexOf(genre) === 0)
      for (const song of filtered) {
        if (offset === 0) {
          library.playingQueue.unshift(song)
        } else {
          library.playingQueue.push(song)
        }
      }
      return { success: true }
    }
    if (options.songs && options.songs.length) {
      const newSongOrder = options.songs.split(',')
      if (options.updated_index) {
        let index = offset
        for (const songid of newSongOrder) {
          const song = library.songs.filter(song => song.id === songid)[0]
          library.playingQueue[index] = song
          index++
        }
      } else {
        for (const songid of newSongOrder) {
          const song = library.songs.filter(song => song.id === songid)[0]
          if (offset === 0) {
            library.playingQueue.unshift(song)
          } else {
            library.playingQueue.push(song)
          }
        }
      }
      return { success: true }
    }
    if (container.type === 'playlist') {
      if (container.id.startsWith('playlist_personal_normal')) {
        const playList = library.playLists.filter(playList => playList.id === container.id)[0]
        for (const song of playList.songs) {
          library.playingQueue.push(song)
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
            library.playingQueue.push(song)
          }
        }
      }
    }
    return { success: true }
  }
}
