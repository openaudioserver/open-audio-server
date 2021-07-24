const library = require('../../../library.js')

module.exports = (_, res, postData) => {
  const offset = postData.offset ? parseInt(postData.offset, 10) || 0 : 0
  const limit = postData.limit ? parseInt(postData.limit, 10) || 0 : 0
  const albumResponse = {
    data: {
      albums: [].concat(library.albums),
      offset: offset || 0
    },
    success: true
  }
  if (postData.composer) {
    const composer = library.composers.filter(composer => composer.name === postData.composer)[0]
    albumResponse.data.albums = albumResponse.data.albums.filter(album => album.composers.indexOf(composer) > -1)
  }
  if (postData.artist) {
    const artist = library.artists.filter(artist => artist.name === postData.artist)[0]
    albumResponse.data.albums = albumResponse.data.albums.filter(album => album.artists.indexOf(artist) > -1)
  }
  if (postData.genre) {
    const genre = library.genres.filter(genre => genre.name === postData.genre)[0]
    albumResponse.data.albums = albumResponse.data.albums.filter(album => album.genres.indexOf(genre) > -1)
  }
  if (postData.keyword) {
    albumResponse.data.albums = albumResponse.data.albums.filter(album => album.title && album.title.toLowerCase().indexOf(postData.keyword.toLowerCase()) > -1)
  }
  if (postData.sort_by) {
    if (postData.sort_by === 'time') {
      albumResponse.data.albums.sort((a, b) => {
        return a.created > b.created ? 1 : -1
      })
    } else {
      for (const textField of ['title', 'artist']) {
        let textFieldName = textField
        if (textField === 'title') {
          textFieldName = 'name'
        }
        if (postData.sort_by === textFieldName) {
          albumResponse.data.albums = albumResponse.data.albums.sort((a, b) => {
            if (postData.sort_direction === 'ASC') {
              return a[textField].toLowerCase() > b[textField].toLowerCase() ? 1 : -1
            } else {
              return a[textField].toLowerCase() < b[textField].toLowerCase() ? 1 : -1
            }
          })
        }
      }
    }
  } else {
    albumResponse.data.albums = albumResponse.data.albums.sort((a, b) => {
      if (!postData.sort_direction || postData.sort_direction === 'ASC') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      }
    })
  }
  albumResponse.data.total = albumResponse.data.albums.length
  if (limit && albumResponse.data.albums.length > limit) {
    albumResponse.data.albums.length = limit
  }
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  return res.end(JSON.stringify(albumResponse))
}
