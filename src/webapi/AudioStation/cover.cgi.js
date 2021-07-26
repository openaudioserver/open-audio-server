const fs = require('fs')
const library = require('../../../library.js')
const path = require('path')
const MusicMetaData = require('music-metadata')
const cache = {}
const existsCache = {}

module.exports = async (_, res, _2, queryData) => {
  if (queryData.id && queryData.id.startsWith('music_')) {
    if (cache[queryData.id]) {
      res.setHeader('content-type', cache[queryData.id].format)
      return res.end(cache[queryData.id].data)
    }
    let song
    if (queryData.id) {
      song = library.songs.filter(song => song.id === queryData.id)[0]
    } else if (queryData.album_name && queryData.album_artist_name) {
      const songs = library.songs.filter(song => song.album === queryData.album_name && song.artist === queryData.album.artist_name)
      for (const track of songs) {
        if (track.hasImage) {
          song = track
          break
        }
      }
    }
    if (!song) {
      const imagePath = path.join(process.env.SYNOMAN_PATH, '/webman/3rdparty/AudioStation/images/_2x/audio_default_songs.png')
      const exists = existsCache[imagePath] = existsCache[imagePath] || fs.existsSync(imagePath)
      if (exists) {
        cache[imagePath] = cache[imagePath] || {
          format: 'image/png',
          data: fs.readFileSync(imagePath)
        }
        res.setHeader('content-type', cache[imagePath].format)
        return res.end(cache[imagePath].data)
      }
    }
    if (song.hasImage) {
      const metaData = await MusicMetaData.parseFile(song.path)
      cache[queryData.id] = {
        format: metaData.common.picture[0].format,
        data: metaData.common.picture[0].data
      }
      res.setHeader('content-type', metaData.common.picture[0].format)
      return res.end(metaData.common.picture[0].data)
    }
    if (queryData.output_default) {
      const imagePath = path.join(process.env.SYNOMAN_PATH, '/webman/3rdparty/AudioStation/images/_2x/audio_default_songs.png')
      const exists = existsCache[imagePath] = existsCache[imagePath] || fs.existsSync(imagePath)
      if (exists) {
        cache[imagePath] = cache[imagePath] || {
          format: 'image/png',
          data: fs.readFileSync(imagePath)
        }
        res.setHeader('content-type', cache[imagePath].format)
        return res.end(cache[imagePath].data)
      }
    }
  }
  if (queryData.id && queryData.id.startsWith('dir_')) {
    if (cache[queryData.id]) {
      res.setHeader('content-type', cache[queryData.id].format)
      return res.end(cache[queryData.id].data)
    }
    const folderPaths = Object.keys(library.folders)
    for (const folderPath of folderPaths) {
      const folder = library.folders[folderPath]
      if (folder.id === queryData.id) {
        const songs = library.songs.filter(song => song.path.startsWith(folderPath))
        for (const song of songs) {
          if (song.hasImage) {
            const metaData = await MusicMetaData.parseFile(song.path)
            cache[queryData.id] = {
              format: metaData.common.picture[0].format,
              data: metaData.common.picture[0].data
            }
            res.setHeader('content-type', metaData.common.picture[0].format)
            return res.end(metaData.common.picture[0].data)
          }
        }
      }
    }
  }
  if (queryData.album_name) {
    if (cache[queryData.album_name]) {
      res.setHeader('content-type', cache[queryData.album_name].format)
      return res.end(cache[queryData.album_name].data)
    }
    const songs = library.songs.filter(song => song.album === queryData.album_name && song.artist === queryData.album_artist_name)
    for (const song of songs) {
      if (song.hasImage) {
        const metaData = await MusicMetaData.parseFile(song.path)
        cache[queryData.album_name] = {
          format: metaData.common.picture[0].format,
          data: metaData.common.picture[0].data
        }
        res.setHeader('content-type', metaData.common.picture[0].format)
        return res.end(metaData.common.picture[0].data)
      }
    }
  }
  if (queryData.artist_name) {
    if (cache[queryData.artist_name]) {
      res.setHeader('content-type', cache[queryData.artist_name].format)
      return res.end(cache[queryData.artist_name].data)
    }
    const songs = library.songs.filter(song => song.artist === queryData.artist_name)
    for (const song of songs) {
      if (song.hasImage) {
        const metaData = await MusicMetaData.parseFile(song.path)
        cache[queryData.artist_name] = {
          format: metaData.common.picture[0].format,
          data: metaData.common.picture[0].data
        }
        res.setHeader('content-type', metaData.common.picture[0].format)
        return res.end(metaData.common.picture[0].data)
      }
    }
  }
  if (queryData.composer_name) {
    if (cache[queryData.composer_name]) {
      res.setHeader('content-type', cache[queryData.composer_name].format)
      return res.end(cache[queryData.composer_name].data)
    }
    const composer = library.composers.filter(composer => composer.name === queryData.composer_name)[0]
    const songs = library.songs.filter(song => song.composers.indexOf(composer) > -1)
    for (const song of songs) {
      if (song.hasImage) {
        const metaData = await MusicMetaData.parseFile(song.path)
        cache[queryData.artist_name] = {
          format: metaData.common.picture[0].format,
          data: metaData.common.picture[0].data
        }
        res.setHeader('content-type', metaData.common.picture[0].format)
        return res.end(metaData.common.picture[0].data)
      }
    }
  }
  if (queryData.default_genre_name) {
    const imagePath = path.join(process.env.SYNOMAN_PATH, `/webman/3rdparty/AudioStation/images/_2x/cover_${queryData.default_genre_name.toLowerCase()}.png`)
    const exists = existsCache[imagePath] = existsCache[imagePath] || fs.existsSync(imagePath)
    if (exists) {
      cache[imagePath] = cache[imagePath] || {
        format: 'image/png',
        data: fs.readFileSync(imagePath)
      }
      res.setHeader('content-type', cache[imagePath].format)
      return res.end(cache[imagePath].data)
    }
  }
  res.setHeader('content-type', 'image/png')
  const defaultImage = cache.defaultImage = cache.defaultImage || fs.readFileSync(path.join(process.env.SYNOMAN_PATH, '/webman/modules/AudioPlayer/images/2x/audio_player_default_album.png'))
  return res.end(defaultImage)
}
