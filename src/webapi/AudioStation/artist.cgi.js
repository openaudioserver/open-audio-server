const library = require('../../../library.js')

module.exports = {
  listArtists,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await listArtists(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listArtists (options) {
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  const limit = options.limit ? parseInt(options.limit, 10) || 0 : 0
  const response = {
    data: {
      artists: [].concat(library.artists),
      offset: offset || 0
    },
    success: true
  }
  if (options.genre) {
    const genre = library.genres.filter(genre => genre.name === options.genre)[0]
    response.data.artists = response.data.artists.filter(artist => artist.genres.indexOf(genre) > -1)
  }
  if (options.keyword) {
    response.data.artists = response.data.artists.filter(artist => artist.name && artist.name.toLowerCase().indexOf(options.keyword.toLowerCase()) > -1)
  }
  if (!options.sort_by || options.sort_by === 'name') {
    response.data.artists = response.data.artists.sort((a, b) => {
      if (!options.sort_direction || options.sort_direction === 'ASC') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      }
    })
  }
  response.data.total = response.data.artists.length
  if (limit && response.data.artists.length > limit) {
    response.data.artists.length = limit
  }
  return response
}
