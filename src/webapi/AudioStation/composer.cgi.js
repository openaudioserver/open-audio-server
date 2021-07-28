const library = require('../../../library.js')

module.exports = {
  listComposers,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await listComposers(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listComposers (options) {
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  const limit = options.limit ? parseInt(options.limit, 10) || 0 : 0
  const response = {
    data: {
      composers: [].concat(library.composers),
      offset: offset || 0
    },
    success: true
  }
  if (options.keyword) {
    response.data.composers = response.data.composers.filter(composer => composer.name.toLowerCase().indexOf(options.keyword.toLowerCase()) > -1)
  }
  if (!options.sort_by || options.sort_by === 'name') {
    response.data.composers = response.data.composers.sort((a, b) => {
      if (!options.sort_direction || options.sort_direction === 'ASC') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      }
    })
  }
  response.data.total = response.data.composers.length
  if (limit && response.data.composers.length > limit) {
    response.data.composers.length = limit
  }
  return response
}
