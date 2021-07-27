const library = require('../../../library.js')

module.exports = (_, res, postData) => {
  const offset = postData.offset ? parseInt(postData.offset, 10) || 0 : 0
  const limit = postData.limit ? parseInt(postData.limit, 10) || 0 : 0
  const composerResponse = {
    data: {
      composers: [].concat(library.composers),
      offset: offset || 0
    },
    success: true
  }
  if (postData.keyword) {
    composerResponse.data.composers = composerResponse.data.composers.filter(composer => composer.name.toLowerCase().indexOf(postData.keyword.toLowerCase()) > -1)
  }
  if (!postData.sort_by || postData.sort_by === 'name') {
    composerResponse.data.composers = composerResponse.data.composers.sort((a, b) => {
      if (!postData.sort_direction || postData.sort_direction === 'ASC') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      }
    })
  }
  composerResponse.data.total = composerResponse.data.composers.length
  if (limit && composerResponse.data.composers.length > limit) {
    composerResponse.data.composers.length = limit
  }
  return res.end(JSON.stringify(composerResponse))
}
