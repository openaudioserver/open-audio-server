const library = require('../../../library.js')

module.exports = {
  listAlbums,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await listAlbums(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listAlbums (options) {
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  const limit = options.limit ? parseInt(options.limit, 10) || 0 : 0
  const response = {
    data: {
      albums: [].concat(library.albums),
      offset: offset || 0
    },
    success: true
  }
  if (options.composer) {
    const composer = library.composers.filter(composer => composer.name === options.composer)[0]
    response.data.albums = response.data.albums.filter(album => album.composers.indexOf(composer) > -1)
  }
  if (options.artist) {
    const artist = library.artists.filter(artist => artist.name === options.artist)[0]
    response.data.albums = response.data.albums.filter(album => album.artists.indexOf(artist) > -1)
  }
  if (options.genre) {
    const genre = library.genres.filter(genre => genre.name === options.genre)[0]
    response.data.albums = response.data.albums.filter(album => album.genres.indexOf(genre) > -1)
  }
  if (options.keyword) {
    response.data.albums = response.data.albums.filter(album => album.title && album.title.toLowerCase().indexOf(options.keyword.toLowerCase()) > -1)
  }
  if (options.sort_by) {
    if (options.sort_by === 'time') {
      response.data.albums.sort((a, b) => {
        return a.created > b.created ? 1 : -1
      })
    } else {
      for (const textField of ['title', 'artist']) {
        let textFieldName = textField
        if (textField === 'title') {
          textFieldName = 'name'
        }
        if (options.sort_by === textFieldName) {
          response.data.albums = response.data.albums.sort((a, b) => {
            if (options.sort_direction === 'ASC') {
              return a[textField].toLowerCase() > b[textField].toLowerCase() ? 1 : -1
            } else {
              return a[textField].toLowerCase() < b[textField].toLowerCase() ? 1 : -1
            }
          })
        }
      }
    }
  } else {
    response.data.albums = response.data.albums.sort((a, b) => {
      if (!options.sort_direction || options.sort_direction === 'ASC') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      }
    })
  }
  response.data.total = response.data.albums.length
  if (limit && response.data.albums.length > limit) {
    response.data.albums.length = limit
  }
  return response
}
