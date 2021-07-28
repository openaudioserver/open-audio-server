const fs = require('fs')
const library = require('../../../library.js')
const path = require('path')
const existsCache = {}

module.exports = {
  listGenres,
  listDefaultGenres,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await listGenres(postData)
        break
      case 'list_default_genre':
        response = await listDefaultGenres()
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listGenres (options) {
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  const limit = options.limit ? parseInt(options.limit, 10) || 0 : 0
  const response = {
    data: {
      genres: [].concat(library.genres),
      offset: offset || 0
    },
    success: true
  }
  if (options.keyword) {
    response.data.genres = response.data.genres.filter(genre => genre.title && genre.title.toLowerCase().indexOf(options.keyword.toLowerCase()) > -1)
  }
  if (!options.sort_by || options.sort_by === 'name') {
    response.data.genres = response.data.genres.sort((a, b) => {
      if (!options.sort_direction || options.sort_direction === 'ASC') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      }
    })
  }
  response.data.total = response.data.genres.length
  if (limit && response.data.genres.length > limit) {
    response.data.genres.length = limit
  }
  return response
}

async function listDefaultGenres () {
  const response = {
    data: {
      default_genres: []
    },
    success: true
  }
  for (const genre of library.genres) {
    const imagePath = path.join(process.env.SYNOMAN_PATH, `/webman/3rdparty/AudioStation/images/_2x/cover_${genre.name.toLowerCase()}.png`)
    const exists = existsCache[imagePath] = existsCache[imagePath] || fs.existsSync(imagePath)
    if (exists) {
      response.data.default_genres.push(genre)
    }
  }
  return response
}
