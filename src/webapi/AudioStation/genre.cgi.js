const fs = require('fs')
const library = require('../../../library.js')
const path = require('path')
const existsCache = {}

module.exports = (_, res, postData) => {
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  if (postData.method === 'list_default_genre') {
    const genreResponse = {
      data: {
        default_genres: []
      },
      success: true
    }
    for (const genre of library.genres) {
      const imagePath = path.join(process.env.SYNOMAN_PATH, `/webman/3rdparty/AudioStation/images/_2x/cover_${genre.name.toLowerCase()}.png`)
      const exists = existsCache[imagePath] = existsCache[imagePath] || fs.existsSync(imagePath)
      if (exists) {
        genreResponse.data.default_genres.push(genre)
      }
    }
    return res.end(JSON.stringify(genreResponse))
  }
  const offset = postData.offset ? parseInt(postData.offset, 10) || 0 : 0
  const limit = postData.limit ? parseInt(postData.limit, 10) || 0 : 0
  const genreResponse = {
    data: {
      genres: [].concat(library.genres),
      offset: offset || 0
    },
    success: true
  }
  if (postData.keyword) {
    genreResponse.data.genres = genreResponse.data.genres.filter(genre => genre.title && genre.title.toLowerCase().indexOf(postData.keyword.toLowerCase()) > -1)
  }
  if (!postData.sort_by || postData.sort_by === 'name') {
    genreResponse.data.genres = genreResponse.data.genres.sort((a, b) => {
      if (!postData.sort_direction || postData.sort_direction === 'ASC') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      }
    })
  }
  genreResponse.data.total = genreResponse.data.genres.length
  if (limit && genreResponse.data.genres.length > limit) {
    genreResponse.data.genres.length = limit
  }
  return res.end(JSON.stringify(genreResponse))
}
