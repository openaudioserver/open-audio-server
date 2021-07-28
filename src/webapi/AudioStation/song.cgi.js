const library = require('../../../library.js')

module.exports = {
  listSongs,
  setRating,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await listSongs(postData)
        break
      case 'setrating':
        response = await setRating(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listSongs (options) {
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  const limit = options.limit ? parseInt(options.limit, 10) || 0 : 0
  const songResponse = {
    data: {
      offset,
      songs: [].concat(library.songs)
    },
    success: true
  }
  if (options.album) {
    songResponse.data.songs = songResponse.data.songs.filter(song => song.album === options.album)
  }
  if (options.composer) {
    const composer = library.composers.filter(composer => composer.name === options.composer)[0]
    songResponse.data.songs = songResponse.data.songs.filter(song => song.composers.indexOf(composer) > -1)
  }
  if (options.genre) {
    const genre = library.genres.filter(genre => genre.name === options.genre)[0]
    songResponse.data.songs = songResponse.data.songs.filter(song => song.genres.indexOf(genre) > -1)
  }
  if (options.artist) {
    const artist = library.artists.filter(artist => artist.name === options.artist)[0]
    songResponse.data.songs = songResponse.data.songs.filter(song => song.artists.indexOf(artist) > -1)
  }
  if (options.sort_by) {
    if (options.sort_by === 'random') {
      songResponse.data.songs.sort(() => {
        return Math.random() > 0.5 ? 1 : -1
      })
    }
    for (const textField of ['title', 'artist', 'album', 'album_artist', 'comment', 'composer', 'genre']) {
      if (options.sort_by === textField) {
        songResponse.data.songs = songResponse.data.songs.sort((a, b) => {
          if (a[textField] && b[textField]) {
            if (options.sort_direction === 'ASC') {
              return a[textField].toLowerCase() > b[textField].toLowerCase() ? 1 : -1
            } else {
              return a[textField].toLowerCase() > b[textField].toLowerCase() ? -1 : 1
            }
          }
          if (!a.additional || !a.additional.song_tag || !a.additional.song_tag[textField]) {
            return -1
          }
          if (!b.additional || !b.additional.song_tag || !b.additional.song_tag[textField]) {
            return 1
          }
          if (options.sort_direction === 'ASC') {
            return a.additional.song_tag[textField].toLowerCase() > b.additional.song_tag[textField].toLowerCase() ? 1 : -1
          } else {
            return a.additional.song_tag[textField].toLowerCase() > b.additional.song_tag[textField].toLowerCase() ? -1 : 1
          }
        })
      }
    }
    for (const integerField of ['duration', 'disc', 'year', 'track']) {
      if (options.sort_by === integerField) {
        songResponse.data.songs = songResponse.data.songs.sort((a, b) => {
          if (!a.additional || !a.additional.song_tag) {
            return 1
          }
          if (!b.additional || !b.additional.song_tag) {
            return -1
          }
          if (options.sort_direction === 'ASC') {
            if (a.additional.song_audio[integerField]) {
              return a.additional.song_audio[integerField] > b.additional.song_audio[integerField] ? 1 : -1
            } else {
              return a.additional.song_tag[integerField] > b.additional.song_tag[integerField] ? 1 : -1
            }
          } else {
            if (a.additional.song_audio[integerField]) {
              return a.additional.song_audio[integerField] < b.additional.song_audio[integerField] ? 1 : -1
            } else {
              return a.additional.song_tag[integerField] < b.additional.song_tag[integerField] ? 1 : -1
            }
          }
        })
      }
    }
  } else {
    songResponse.data.songs = songResponse.data.songs.sort((a, b) => {
      if (a.name && b.name) {
        return a.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      }
      return 1
    })
  }
  songResponse.data.total = songResponse.data.songs.length
  if (limit && songResponse.data.songs.length > limit) {
    songResponse.data.songs.length = limit
  }
  return songResponse
}

async function setRating (options) {
  const songids = options.id.split(',')
  for (const songid of songids) {
    const song = library.songs.filter(song => song.id === songid)[0]
    song.additional.song_rating.rating = parseInt(options.rating, 10)
  }
  await library.rewriteRatings()
  return listSongs(options)
}
