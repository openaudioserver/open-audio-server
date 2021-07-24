const library = require('../../../library.js')

module.exports = (req, res, postData, queryData) => {
  const searchResponse = {
    data: {
    },
    success: true
  }
  searchResponse.data.albums = library.albums.filter(album => album.title && album.title.toLowerCase().indexOf(postData.keyword.toLowerCase()) > -1)
  searchResponse.data.artists = library.artists.filter(artist => artist.title && artist.title.toLowerCase().indexOf(postData.keyword.toLowerCase()) > -1)
  searchResponse.data.songs = library.songs.filter(song => song.additional.song_tag.title.toLowerCase().indexOf(postData.keyword.toLowerCase()) > -1)
  searchResponse.data.albumTotal = searchResponse.data.albums.length
  searchResponse.data.artistsTotal = searchResponse.data.artists.length
  searchResponse.data.songsTotal = searchResponse.data.songs.length
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  return res.end(JSON.stringify(searchResponse))
}
