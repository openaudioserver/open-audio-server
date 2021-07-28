const library = require('../../../library.js')

module.exports = {
  searchLibrary,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await searchLibrary(postData)
        break
    }
    if (response.buffer) {
      res.writeHead(206, {
        'content-type': response.contentType,
        'content-length': response.buffer.length
      })
      return res.end(response.buffer)
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function searchLibrary (options) {
  const response = {
    data: {
      albums: library.albums.filter(album => album.title && album.title.toLowerCase().indexOf(options.keyword.toLowerCase()) > -1),
      artists: library.artists.filter(artist => artist.title && artist.title.toLowerCase().indexOf(options.keyword.toLowerCase()) > -1),
      songs: library.songs.filter(song => song.additional.song_tag.title.toLowerCase().indexOf(options.keyword.toLowerCase()) > -1)

    },
    success: true
  }
  response.data.albumTotal = response.data.albums.length
  response.data.artistsTotal = response.data.artists.length
  response.data.songsTotal = response.data.songs.length
  return response
}
