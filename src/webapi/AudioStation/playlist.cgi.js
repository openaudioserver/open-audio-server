const library = require('../../../library.js')

module.exports = (req, res, postData) => {
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  if (postData.method === 'create') {
    const playList = {
      id: `playlist_personal_normal/${postData.name}`,
      name: postData.name,
      library: 'personal',
      type: 'normal',
      sharing_status: 'none',
      additional:
      {
        sharing_info:
        {
          date_available: '0',
          date_expired: '0',
          id: '',
          status: 'none',
          url: ''
        },
        songs: [],
        songs_offset: 0,
        songs_total: 0
      }
    }
    if (postData.songs) {
      const songs = postData.songs.split(',')
      for (const songid of songs) {
        const song = library.songs.filter(song => song.id === songid)[0]
        playList.additional.songs.push(song.path)
      }
    } else {
      for (const song of library.playingQueue) {
        playList.additional.songs.push(song.path)
      }
    }
    library.playLists.push(playList)
    library.rewritePlayLists()
    return res.end(`{ "data": { "id": "playlist_personal_normal/${postData.name}" }, "success": true }`)
  } else if (postData.method === 'add_track') {
    const playList = library.playLists.filter(playList => playList.id === postData.id)[0]
    if (postData.album) {
      const album = postData.album.split('"').join('')
      const artistName = postData.album_artist.split('"').join('')
      const artist = library.artists.filter(artist => artist.name === artistName)[0]
      const songs = library.songs.filter(song => song.album === album && song.artists.indexOf(artist) > -1)
      for (const song of songs) {
        playList.additional.songs.push(song.path)
      }
    } else if (postData.artist) {
      const artistName = postData.artist.split('"').join('')
      const artist = library.artists.filter(artist => artist.name === artistName)[0]
      const songs = library.songs.filter(song => song.artists.indexOf(artist) > -1)
      for (const song of songs) {
        playList.additional.songs.push(song.path)
      }
    } else if (postData.composer) {
      const composerName = postData.composer.split('"').join('')
      const composer = library.composers.filter(composer => composer.name === composerName)[0]
      const songs = library.songs.filter(song => song.composers.indexOf(composer) > -1)
      for (const song of songs) {
        playList.additional.songs.push(song.path)
      }
    } else if (postData.genre) {
      const genreName = postData.genre.split('"').join('')
      const genre = library.genres.filter(genre => genre.name === genreName)[0]
      const songs = library.songs.filter(song => song.genres.indexOf(genre) > -1)
      for (const song of songs) {
        playList.additional.songs.push(song.path)
      }
    }
    library.rewritePlayLists()
    return res.end(`{ "data": { "id": "${postData.name}" }, "success": true }`)
  } else if (postData.method === 'delete') {
    const ids = postData.id.split(',')
    for (const id of ids) {
      const playList = library.playLists.filter(playList => playList.id === id)[0]
      library.playLists.splice(library.playLists.indexOf(playList), 1)
    }
    library.rewritePlayLists()
    return res.end('{ "success": true }')
  } else if (postData.method === 'rename') {
    const playList = library.playLists.filter(playList => playList.id === postData.id)
    playList.id = `playlist_personal_normal/${postData.new_name}`
    playList.name = postData.new_name
    library.rewritePlayLists()
    return res.end(`{ "data": { "id": "playlist_personal_normal/${playList.id}" }, "success": true }`)
  } else if (postData.method === 'createsmart') {
    const playList = {
      id: `playlist_personal_smart/${postData.name}`,
      name: postData.name,
      library: 'personal',
      type: 'smart',
      sharing_status: 'none',
      additional:
      {
        rules: JSON.parse(postData.rules_json),
        rules_conjunction: postData.conj_rule
      }
    }
    library.playLists.push(playList)
    library.rewritePlayLists()
    return res.end(`{ "data": { "id": "${playList.id}" }, "success": true }`)
  } else if (postData.method === 'updatesmart') {
    const playList = library.playLists.filter(playList => playList.id === postData.id)
    playList.id = `playlist_personal_smart/${postData.name}`
    playList.name = postData.new_name
    playList.additional = {
      rules: JSON.parse(postData.rules_json)
    }
    library.rewritePlayLists()
    return res.end(`{ "data": { "id": "${playList.id}" }, "success": true }`)
  }
  const playListResponse = {
    offset: 0,
    data: {
    },
    success: true
  }
  if (postData.method === 'getinfo' && postData.id) {
    playListResponse.data.playlists = library.playLists.filter(playList => playList.id === postData.id)
  } else {
    playListResponse.data.playlists = library.playLists
  }
  playListResponse.data.playlists = JSON.parse(JSON.stringify(playListResponse.data.playlists))
  for (const playlist of playListResponse.data.playlists) {
    for (const i in playlist.additional.songs) {
      if (playlist.additional.songs[i].substring) {
        playlist.additional.songs[i] = library.songs.filter(song => song.path === playlist.additional.songs[i])[0]
      }
    }
  }
  playListResponse.data.total = playListResponse.data.playlists.length
  return res.end(JSON.stringify(playListResponse))
}
