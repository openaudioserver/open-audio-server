const library = require('../../../library.js')

module.exports = async (_, res, postData) => {
  if (postData.method === 'setrating') {
    const songids = postData.id.split(',')
    for (const songid of songids) {
      const song = library.songs.filter(song => song.id === songid)[0]
      song.additional.song_rating.rating = parseInt(postData.rating, 10)
    }
    await library.rewriteRatings()
  }
  const offset = postData.offset ? parseInt(postData.offset, 10) || 0 : 0
  const limit = postData.limit ? parseInt(postData.limit, 10) || 0 : 0
  const songResponse = {
    data: {
      offset,
      songs: [].concat(library.songs)
    },
    success: true
  }
  if (postData.album) {
    songResponse.data.songs = songResponse.data.songs.filter(song => song.album === postData.album)
  }
  if (postData.composer) {
    const composer = library.composers.filter(composer => composer.name === postData.composer)[0]
    songResponse.data.songs = songResponse.data.songs.filter(song => song.composers.indexOf(composer) > -1)
  }
  if (postData.genre) {
    const genre = library.genres.filter(genre => genre.name === postData.genre)[0]
    songResponse.data.songs = songResponse.data.songs.filter(song => song.genres.indexOf(genre) > -1)
  }
  if (postData.artist) {
    const artist = library.artists.filter(artist => artist.name === postData.artist)[0]
    songResponse.data.songs = songResponse.data.songs.filter(song => song.artists.indexOf(artist) > -1)
  }
  if (postData.sort_by) {
    if (postData.sort_by === 'random') {
      songResponse.data.songs.sort(() => {
        return Math.random() > 0.5 ? 1 : -1
      })
    }
    for (const textField of ['title', 'artist', 'album', 'album_artist', 'comment', 'composer', 'genre']) {
      if (postData.sort_by === textField) {
        songResponse.data.songs = songResponse.data.songs.sort((a, b) => {
          if (a[textField] && b[textField]) {
            if (postData.sort_direction === 'ASC') {
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
          if (postData.sort_direction === 'ASC') {
            return a.additional.song_tag[textField].toLowerCase() > b.additional.song_tag[textField].toLowerCase() ? 1 : -1
          } else {
            return a.additional.song_tag[textField].toLowerCase() > b.additional.song_tag[textField].toLowerCase() ? -1 : 1
          }
        })
      }
    }
    for (const integerField of ['duration', 'disc', 'year', 'track']) {
      if (postData.sort_by === integerField) {
        songResponse.data.songs = songResponse.data.songs.sort((a, b) => {
          if (!a.additional || !a.additional.song_tag) {
            return 1
          }
          if (!b.additional || !b.additional.song_tag) {
            return -1
          }
          if (postData.sort_direction === 'ASC') {
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
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  return res.end(JSON.stringify(songResponse))
}
