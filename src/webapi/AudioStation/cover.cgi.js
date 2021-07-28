const fs = require('fs')
const library = require('../../../library.js')
const path = require('path')
const MusicMetaData = require('music-metadata')
const cache = {}
const existsCache = {}

module.exports = {
  coverImage,
  httpRequest: async (req, res, _2, queryData) => {
    let response
    switch (queryData.method) {
      case 'getcover':
        response = await coverImage(queryData)
        break
      case 'getsongcover':
        response = await coverImage(queryData)
        break
    }
    if (response && response.buffer) {
      res.writeHead(206, {
        'content-type': response.format,
        'content-length': response.buffer.length
      })
      return res.end(response.buffer)
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function coverImage (options) {
  if (options.id && options.id.startsWith('music_')) {
    if (cache[options.id]) {
      return cache[options.id]
    }
    const song = library.songs.filter(song => song.id === options.id)[0]
    if (song && song.hasImage) {
      const metaData = await MusicMetaData.parseFile(song.path)
      cache[options.id] = {
        format: metaData.common.picture[0].format,
        buffer: metaData.common.picture[0].data
      }
      return cache[options.id]
    } else {
      const imagePath = path.join(process.env.SYNOMAN_PATH, '/webman/3rdparty/AudioStation/images/_2x/audio_default_songs.png')
      const exists = existsCache[imagePath] = existsCache[imagePath] === undefined ? fs.existsSync(imagePath) : existsCache[imagePath]
      if (exists) {
        cache[imagePath] = {
          format: 'image/png',
          buffer: fs.readFileSync(imagePath)
        }
        return cache[imagePath]
      }
    }
  }
  if (options.id && options.id.startsWith('dir_')) {
    if (cache[options.id]) {
      return cache[options.id]
    }
    const folderPaths = Object.keys(library.folders)
    for (const folderPath of folderPaths) {
      const folder = library.folders[folderPath]
      if (folder.id === options.id) {
        const songs = library.songs.filter(song => song.path.startsWith(folderPath))
        for (const song of songs) {
          if (song.hasImage) {
            const metaData = await MusicMetaData.parseFile(song.path)
            cache[options.id] = {
              format: metaData.common.picture[0].format,
              buffer: metaData.common.picture[0].data
            }
            return cache[options.id]
          }
        }
      }
    }
  }
  if (options.album_name) {
    if (cache[options.album_name]) {
      return cache[options.album_name]
    }
    const songs = library.songs.filter(song => song.album === options.album_name && song.artist === options.album_artist_name)
    for (const song of songs) {
      if (song.hasImage) {
        const metaData = await MusicMetaData.parseFile(song.path)
        cache[options.album_name] = {
          format: metaData.common.picture[0].format,
          buffer: metaData.common.picture[0].data
        }
        return cache[options.album_name]
      }
    }
  }
  if (options.artist_name) {
    if (cache[options.artist_name]) {
      return cache[options.artist_name]
    }
    const songs = library.songs.filter(song => song.artist === options.artist_name)
    for (const song of songs) {
      if (song.hasImage) {
        const metaData = await MusicMetaData.parseFile(song.path)
        cache[options.artist_name] = {
          format: metaData.common.picture[0].format,
          buffer: metaData.common.picture[0].data
        }
        return cache[options.artist_name]
      }
    }
  }
  if (options.composer_name) {
    if (cache[options.composer_name]) {
      return cache[options.composer_name]
    }
    const composer = library.composers.filter(composer => composer.name === options.composer_name)[0]
    const songs = library.songs.filter(song => song.composers.indexOf(composer) > -1)
    for (const song of songs) {
      if (song.hasImage) {
        const metaData = await MusicMetaData.parseFile(song.path)
        cache[options.composer_name] = {
          format: metaData.common.picture[0].format,
          buffer: metaData.common.picture[0].data
        }
        return cache[options.composer_name]
      }
    }
  }
  if (options.default_genre_name) {
    const imagePath = path.join(process.env.SYNOMAN_PATH, `/webman/3rdparty/AudioStation/images/_2x/cover_${options.default_genre_name.toLowerCase()}.png`)
    const exists = existsCache[imagePath] = existsCache[imagePath] === undefined ? fs.existsSync(imagePath) : existsCache[imagePath]
    if (exists) {
      cache[imagePath] = cache[imagePath] || {
        format: 'image/png',
        buffer: fs.readFileSync(imagePath)
      }
      return cache[imagePath]
    }
  }
  cache.defaultImage = cache.defaultImage || {
    buffer: fs.readFileSync(path.join(process.env.SYNOMAN_PATH, '/webman/modules/AudioPlayer/images/2x/audio_player_default_album.png')),
    format: 'image/png'
  }
  return cache.defaultImage
}
