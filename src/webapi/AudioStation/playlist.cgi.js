const library = require('../../../library.js')

module.exports = {
  getPlayList,
  listPlayLists,
  createNormalPlayList,
  createSmartPlayList,
  addTrackToNormalPlayList,
  updateSmartPlayList,
  renamePlayList,
  deletePlaylist,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'getinfo':
        response = await getPlayList(postData)
        break
      case 'list':
        response = await listPlayLists(postData)
        break
      case 'create':
        response = await createNormalPlayList(postData)
        break
      case 'add_track':
        response = await addTrackToNormalPlayList(postData)
        break
      case 'createsmart':
        response = await createSmartPlayList(postData)
        break
      case 'updatesmart':
        response = await updateSmartPlayList(postData)
        break
      case 'rename':
        response = await renamePlayList(postData)
        break
      case 'delete':
        response = await deletePlaylist(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function getPlayList (options) {
  const response = {
    offset: 0,
    data: {
      playlists: library.playLists.filter(playList => playList.id === options.id)
    },
    success: true
  }
  response.data.playlists = JSON.parse(JSON.stringify(response.data.playlists))
  for (const playlist of response.data.playlists) {
    for (const i in playlist.additional.songs) {
      if (playlist.additional.songs[i].substring) {
        playlist.additional.songs[i] = library.songs.filter(song => song.path === playlist.additional.songs[i])[0]
      }
    }
  }
  response.data.total = response.data.playlists.length
  return response
}

async function listPlayLists () {
  const response = {
    offset: 0,
    data: {
      playlists: library.playLists
    },
    success: true
  }
  response.data.playlists = JSON.parse(JSON.stringify(response.data.playlists))
  for (const playlist of response.data.playlists) {
    for (const i in playlist.additional.songs) {
      if (playlist.additional.songs[i].substring) {
        playlist.additional.songs[i] = library.songs.filter(song => song.path === playlist.additional.songs[i])[0]
      }
    }
  }
  response.data.total = response.data.playlists.length
  return response
}

async function createNormalPlayList (options) {
  const playList = {
    id: `playlist_personal_normal/${options.name}`,
    name: options.name,
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
  if (options.songs) {
    const songs = options.songs.split(',')
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
  return {
    data: {
      id: `playlist_personal_normal/${options.name}`
    },
    success: true
  }
}

async function addTrackToNormalPlayList (options) {
  const playList = library.playLists.filter(playList => playList.id === options.id)[0]
  if (options.album) {
    const album = options.album.split('"').join('')
    const artistName = options.album_artist.split('"').join('')
    const artist = library.artists.filter(artist => artist.name === artistName)[0]
    const songs = library.songs.filter(song => song.album === album && song.artists.indexOf(artist) > -1)
    for (const song of songs) {
      playList.additional.songs.push(song.path)
    }
  } else if (options.artist) {
    const artistName = options.artist.split('"').join('')
    const artist = library.artists.filter(artist => artist.name === artistName)[0]
    const songs = library.songs.filter(song => song.artists.indexOf(artist) > -1)
    for (const song of songs) {
      playList.additional.songs.push(song.path)
    }
  } else if (options.composer) {
    const composerName = options.composer.split('"').join('')
    const composer = library.composers.filter(composer => composer.name === composerName)[0]
    const songs = library.songs.filter(song => song.composers.indexOf(composer) > -1)
    for (const song of songs) {
      playList.additional.songs.push(song.path)
    }
  } else if (options.genre) {
    const genreName = options.genre.split('"').join('')
    const genre = library.genres.filter(genre => genre.name === genreName)[0]
    const songs = library.songs.filter(song => song.genres.indexOf(genre) > -1)
    for (const song of songs) {
      playList.additional.songs.push(song.path)
    }
  }
  library.rewritePlayLists()
  return {
    data: {
      id: options.name
    },
    success: true
  }
}

async function createSmartPlayList (options) {
  const playList = {
    id: `playlist_personal_smart/${options.name}`,
    name: options.name,
    library: 'personal',
    type: 'smart',
    sharing_status: 'none',
    additional:
    {
      rules: JSON.parse(options.rules_json),
      rules_conjunction: options.conj_rule
    }
  }
  library.playLists.push(playList)
  library.rewritePlayLists()
  return {
    data: {
      id: playList.id
    },
    success: true
  }
}

async function updateSmartPlayList (options) {
  const playList = library.playLists.filter(playList => playList.id === options.id)
  playList.id = `playlist_personal_smart/${options.name}`
  playList.name = options.new_name
  playList.additional = {
    rules: JSON.parse(options.rules_json)
  }
  library.rewritePlayLists()
  return {
    data: {
      id: playList.id
    },
    success: true
  }
}

async function renamePlayList (options) {
  const playList = library.playLists.filter(playList => playList.name === options.id.split('/')[1])
  playList.id = `playlist_personal_normal/${options.new_name}`
  playList.name = options.new_name
  library.rewritePlayLists()
  return {
    data: {
      id: `playlist_personal_normal/${playList.id}`
    },
    success: true
  }
}

async function deletePlaylist (options) {
  const ids = options.id.split(',')
  for (const id of ids) {
    const playList = library.playLists.filter(playList => playList.id === id)[0]
    library.playLists.splice(library.playLists.indexOf(playList), 1)
  }
  library.rewritePlayLists()
  return { success: true }
}
