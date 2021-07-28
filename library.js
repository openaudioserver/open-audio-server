const fs = require('fs')
const path = require('path')
const util = require('util')
const zlib = require('zlib')
const unzipAsync = util.promisify(zlib.unzip)

const artists = []
const albums = []
const songs = []
const genres = []
const composers = []
const playingQueue = []
const remoteQueue = []

const folders = {}
const playLists = []
const pinList = []
const radios = []
const favoriteRadios = []
const songRatings = {}
const songEdits = {}
const radioStreams = {}
let lastReadSize = 0

setInterval(load, 1000)

module.exports = {
  rewriteSongList,
  rewriteEdits,
  rewriteRatings,
  rewritePins,
  rewritePlayLists,
  rewriteRadios,
  rewriteFavoriteRadios,
  artists,
  albums,
  songs,
  genres,
  folders,
  composers,
  playingQueue,
  remoteQueue,
  remoteQueueIndex: 0,
  remotePlayerProgress: 0,
  remoteQueuePlaying: false,
  playLists,
  pinList,
  radios,
  favoriteRadios,
  songEdits,
  songRatings,
  radioStreams,
  load
}

async function load () {
  const dataCachePath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'data.json.gzip' : 'data.json')
  let songDataList
  if (fs.existsSync(dataCachePath)) {
    const stat = fs.statSync(dataCachePath)
    if (stat.size === lastReadSize) {
      return
    }
    let rawData = fs.readFileSync(dataCachePath)
    if (process.env.GZIP) {
      rawData = await unzipAsync(rawData)
    }
    songDataList = JSON.parse(rawData)
    lastReadSize = stat.size
  }
  if (!songDataList || !songDataList.length) {
    lastReadSize = 0
    return
  }
  for (const key in songRatings) {
    delete (songRatings[key])
  }
  const songRatingsPath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'ratings.json.gzip' : 'ratings.json')
  if (fs.existsSync(songRatingsPath)) {
    const rawData = fs.readFileSync(songRatingsPath)
    const unzipAsync = util.promisify(zlib.unzip)
    const unzipped = await unzipAsync(rawData)
    const ratings = JSON.parse(unzipped)
    for (const key in ratings) {
      songRatings[key] = ratings[key]
    }
  }
  const songEditsPath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'edits.json.gzip' : 'edits.json')
  if (fs.existsSync(songEditsPath)) {
    const rawData = fs.readFileSync(songEditsPath)
    const unzipAsync = util.promisify(zlib.unzip)
    const unzipped = await unzipAsync(rawData)
    const edits = JSON.parse(unzipped)
    for (const key in edits) {
      songEdits[key] = edits[key]
    }
  }
  playLists.length = 0
  const playListsPath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'playlists.json.gzip' : 'playlists.json')
  if (fs.existsSync(playListsPath)) {
    const rawData = fs.readFileSync(playListsPath)
    const unzipAsync = util.promisify(zlib.unzip)
    const unzipped = await unzipAsync(rawData)
    const data = JSON.parse(unzipped)
    for (const item of data) {
      playLists.push(item)
    }
  }
  if (!playLists.filter(playList => playList.id === 'playlist_personal_normal/__SYNO_AUDIO_SHARED_SONGS__').length) {
    playLists.push({
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
        songs_offset: 0,
        songs_total: 0
      },
      id: 'playlist_personal_normal/__SYNO_AUDIO_SHARED_SONGS__',
      library: 'personal',
      name: '__SYNO_AUDIO_SHARED_SONGS__',
      sharing_status: 'none',
      type: 'normal'
    })
  }
  pinList.length = 0
  const pinListPath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'pinlist.json.gzip' : 'pinlist.json')
  if (fs.existsSync(pinListPath)) {
    const rawData = fs.readFileSync(pinListPath)
    const unzipAsync = util.promisify(zlib.unzip)
    const unzipped = await unzipAsync(rawData)
    const data = JSON.parse(unzipped)
    for (const item of data) {
      item.id = (pinList.length + 1).toString()
      pinList.push(item)
    }
  }
  radios.length = 0
  const radiosPath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'radios.json.gzip' : 'radios.json')
  if (fs.existsSync(radiosPath)) {
    const rawData = fs.readFileSync(radiosPath)
    const unzipAsync = util.promisify(zlib.unzip)
    const unzipped = await unzipAsync(rawData)
    const data = JSON.parse(unzipped)
    for (const item of data) {
      radios.push(item)
    }
  }
  favoriteRadios.length = 0
  const favoriteRadiosPath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'favorite-radios.json.gzip' : 'favorite-radios.json')
  if (fs.existsSync(favoriteRadiosPath)) {
    const rawData = fs.readFileSync(favoriteRadiosPath)
    const unzipAsync = util.promisify(zlib.unzip)
    const unzipped = await unzipAsync(rawData)
    const data = JSON.parse(unzipped)
    for (const item of data) {
      favoriteRadiosPath.push(item)
    }
  }
  songs.length = 0
  genres.length = 0
  composers.length = 0
  albums.length = 0
  artists.length = 0
  // map songs
  const objectIndex = {}
  for (const song of songDataList) {
    song.id = `music_${songs.length + 1}`
    song.type = 'file'
    song.path = path.join(process.env.MUSIC_PATH, song.artistFolder, song.albumFolder, song.songFile)
    song.title = song.additional.song_tag.title
    song.additional.song_rating = {
      rating: songRatings[song.path] || 0
    }
    if (songEdits[song.path]) {
      song.additional.song_tag.title = songEdits[song.path].title
      song.additional.song_tag.album = songEdits[song.path].album
      song.additional.song_tag.album_artist = songEdits[song.path].album_artist
      song.additional.song_tag.track = songEdits[song.path].track
      song.additional.song_tag.disc = songEdits[song.path].disc
      song.additional.song_tag.year = songEdits[song.path].year
      song.additional.song_tag.comment = songEdits[song.path].comment
      song.artist = songEdits[song.path].artist
      song.composer = songEdits[song.path].composer
      song.genre = songEdits[song.path].genre
    }
    for (const field of ['artists', 'genres', 'composers']) {
      const value = song[field]
      if (!value) {
        if (field === 'artists') {
          const key = song.artist.toLowerCase().trim()
          const object = objectIndex[key] = objectIndex[key] || {
            name: song.artist,
            title: song.artist,
            genres: [],
            additional: {
              avg_rating: {
                rating: 0
              }
            }
          }
          song.artists = [object]
        } else {
          song[field] = []
        }
        continue
      }
      const array = value.split(',')
      const objectArray = []
      for (const name of array) {
        const key = name.toLowerCase().trim()
        const object = objectIndex[key] = objectIndex[key] || {
          name: name,
          title: name,
          genres: [],
          additional: {
            avg_rating: {
              rating: 0
            }
          }
        }
        objectArray.push(object)
      }
      song[field] = objectArray
    }
    songs.push(song)
    // map genres
    for (const artist of song.artists) {
      artist.genres = artist.genres || []
      for (const genre of song.genres) {
        if (artist.genres.indexOf(genre) === -1) {
          artist.genres.push(genre)
        }
      }
    }
  }
  // map albums
  const uniqueAlbums = {}
  for (const song of songs) {
    const albumPath = path.join(process.env.MUSIC_PATH, song.artistFolder, song.albumFolder)
    if (uniqueAlbums[albumPath]) {
      continue
    }
    uniqueAlbums[albumPath] = true
    const album = {
      album_artist: song.artist,
      artist: song.artist,
      display_artist: song.artist,
      created: Math.floor(fs.statSync(albumPath).ctime.getTime() / 1000),
      path: albumPath,
      name: song.album || song.albumFolder,
      title: song.album || song.albumFolder,
      year: song.additional.song_tag.year,
      additional: {
        rating: 0
      }
    }
    album.songs = songs.filter(song => song.path.startsWith(albumPath))
    album.artists = []
    album.genres = []
    album.composers = []
    for (const song of album.songs) {
      for (const artist of song.artists) {
        if (album.artists.indexOf(artist) === -1) {
          album.artists.push(artist)
        }
        if (artists.indexOf(artist) === -1) {
          artists.push(artist)
        }
      }
      for (const genre of song.genres) {
        if (album.genres.indexOf(genre) === -1) {
          album.genres.push(genre)
        }
        if (genres.indexOf(genre) === -1) {
          genres.push(genre)
        }
      }
      for (const composer of song.composers) {
        if (album.composers.indexOf(composer) === -1) {
          album.composers.push(composer)
        }
        if (composers.indexOf(composer) === -1) {
          composers.push(composer)
        }
      }
    }
    albums.push(album)
  }
  // map folders
  for (const key in folders) {
    delete (folders[key])
  }
  const index = [process.env.MUSIC_PATH]
  const rootFolder = {
    id: 'dir_1',
    path: process.env.MUSIC_PATH,
    items: []
  }
  folders[process.env.MUSIC_PATH] = rootFolder
  const artistFolders = fs.readdirSync(process.env.MUSIC_PATH)
  for (const artist of artistFolders) {
    const artistFolder = {
      id: `dir_${index.length + 1}`,
      path: path.join(process.env.MUSIC_PATH, artist),
      items: [],
      type: 'folder',
      is_persona: false,
      title: artist
    }
    const artistSongs = songs.filter(song => song.path.startsWith(artistFolder.path))
    if (!artistSongs.length) {
      continue
    }
    index.push(artistFolder.path)
    rootFolder.items.push(artistFolder)
    folders[artistFolder.path] = artistFolder
    const albumFolders = fs.readdirSync(artistFolder.path)
    for (const album of albumFolders) {
      const albumFolder = {
        id: `dir_${index.length + 1}`,
        path: path.join(artistFolder.path, album),
        items: [],
        type: 'folder',
        is_personal: false,
        title: album
      }
      const albumSongs = artistSongs.filter(song => song.path.startsWith(albumFolder.path))
      if (!albumSongs.length) {
        continue
      }
      artistFolder.items.push(albumFolder)
      folders[albumFolder.path] = albumFolder
      index.push(albumFolder.path)
      for (const song of albumSongs) {
        albumFolder.items.push(song)
      }
    }
  }
}

async function rewriteSongList () {
  if (!process.env.CACHE_PATH) {
    return
  }
  const songList = JSON.parse(JSON.stringify(songs))
  for (const song of songList) {
    delete (song.id)
    delete (song.type)
    delete (song.path)
    delete (song.title)
    delete (song.additional.rating)
    const songArtists = []
    for (const artist of song.artists) {
      songArtists.push(artist.name)
    }
    const songComposers = []
    for (const composer of song.composers) {
      songComposers.push(composer.name)
    }
    const songGenres = []
    for (const genre of song.genres) {
      songGenres.push(genre.name)
    }
    song.artists = songArtists.join(',')
    song.composers = songComposers.join(',')
    song.genres = songGenres.join(',')
  }
  const dataCachePath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'data.json.gzip' : 'data.json')
  const gzipAsync = util.promisify(zlib.gzip)
  const compressedData = await gzipAsync(JSON.stringify(songList))
  fs.writeFileSync(dataCachePath, compressedData)
}

async function rewriteRatings () {
  if (!process.env.CACHE_PATH) {
    return
  }
  for (const song of songs) {
    if (song.additional.song_rating.rating > 0) {
      songRatings[song.path] = song.additional.song_rating.rating
    }
  }
  const dataCachePath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'ratings.json.gzip' : 'ratings.json')
  const gzipAsync = util.promisify(zlib.gzip)
  const compressedData = await gzipAsync(JSON.stringify(songRatings))
  fs.writeFileSync(dataCachePath, compressedData)
}

async function rewriteEdits () {
  if (!process.env.CACHE_PATH) {
    return
  }
  const dataCachePath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'edits.json.gzip' : 'edits.json')
  const gzipAsync = util.promisify(zlib.gzip)
  const compressedData = await gzipAsync(JSON.stringify(songEdits))
  fs.writeFileSync(dataCachePath, compressedData)
}

async function rewritePins () {
  return rewrite('pinlist', pinList)
}

async function rewritePlayLists () {
  return rewrite('playlists', playLists)
}

async function rewriteRadios () {
  return rewrite('radios', radios)
}

async function rewriteFavoriteRadios () {
  return rewrite('favorite-radios', favoriteRadios)
}

async function rewrite (name, array) {
  if (!process.env.CACHE_PATH) {
    return
  }
  const dataCachePath = path.join(process.env.CACHE_PATH, process.env.GZIP ? `${name}.json.gzip` : `${name}.json`)
  const gzipAsync = util.promisify(zlib.gzip)
  const compressedData = await gzipAsync(JSON.stringify(array))
  fs.writeFileSync(dataCachePath, compressedData)
}
