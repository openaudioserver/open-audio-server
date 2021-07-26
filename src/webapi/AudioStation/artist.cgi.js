const library = require('../../../library.js')

module.exports = (_, res, postData) => {
  const offset = postData.offset ? parseInt(postData.offset, 10) || 0 : 0
  const limit = postData.limit ? parseInt(postData.limit, 10) || 0 : 0
  const artistResponse = {
    data: {
      artists: [].concat(library.artists),
      offset: offset || 0
    },
    success: true
  }
  if (postData.genre) {
    const genre = library.genres.filter(genre => genre.name === postData.genre)[0]
    artistResponse.data.artists = artistResponse.data.artists.filter(artist => artist.genres.indexOf(genre) > -1)
  }
  if (postData.keyword) {
    artistResponse.data.artists = artistResponse.data.artists.filter(artist => artist.name && artist.name.toLowerCase().indexOf(postData.keyword.toLowerCase()) > -1)
  }
  if (!postData.sort_by || postData.sort_by === 'name') {
    artistResponse.data.artists = artistResponse.data.artists.sort((a, b) => {
      if (!postData.sort_direction || postData.sort_direction === 'ASC') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      }
    })
  }
  artistResponse.data.total = artistResponse.data.artists.length
  if (limit && artistResponse.data.artists.length > limit) {
    artistResponse.data.artists.length = limit
  }
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  return res.end(JSON.stringify(artistResponse))
}
