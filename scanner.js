const fs = require('fs')
const MusicMetaData = require('music-metadata')
const path = require('path')
const util = require('util')
const zlib = require('zlib')
const gzipAsync = util.promisify(zlib.gzip)

module.exports = {
  start: scanMusicPath
}

async function scanMusicPath (rescan) {
  const dataCachePath = path.join(process.env.CACHE_PATH, process.env.GZIP ? 'data.json.gzip' : 'data.json')
  if (fs.existsSync(dataCachePath) && !rescan) {
    return
  }
  const dataList = await scanArtists(rescan)
  if (process.env.GZIP) {
    const compressedData = await gzipAsync(JSON.stringify(dataList))
    fs.writeFileSync(dataCachePath, compressedData)
  } else {
    fs.writeFileSync(dataCachePath, JSON.stringify(dataList))
  }
}

async function scanArtists () {
  const songs = []
  const artistFolders = fs.readdirSync(process.env.MUSIC_PATH)
  for (const artistFolder of artistFolders) {
    const artistFolderPath = path.join(process.env.MUSIC_PATH, artistFolder)
    const stat = fs.statSync(artistFolderPath)
    if (stat.isDirectory()) {
      await scanArtistPath(artistFolder, songs)
    }
  }
  return songs
}

async function scanArtistPath (artist, songs) {
  const artistFolderPath = path.join(process.env.MUSIC_PATH, artist)
  const artistAlbums = fs.readdirSync(artistFolderPath)
  let found = 0
  for (const album of artistAlbums) {
    const albumFolderPath = path.join(artistFolderPath, album)
    const stat = fs.statSync(albumFolderPath)
    if (stat.isDirectory()) {
      const albumContents = fs.readdirSync(albumFolderPath)
      const albumSongs = albumContents.filter(file => file.endsWith('.mp3') || file.endsWith('.flac'))
      if (albumSongs && albumSongs.length) {
        found++
        for (const songFile of albumSongs) {
          const songFilePath = path.join(albumFolderPath, songFile)
          const songStat = fs.statSync(songFilePath)
          let metaData
          try {
            metaData = await MusicMetaData.parseFile(songFilePath)
          } catch (error) {
            console.error(error.message)
          }
          const song = {
            additional: {
              song_audio: {
                duration: parseInt(metaData.format.duration, 10),
                bitrate: parseInt(metaData.format.bitrate, 10),
                codec: metaData.format.codec.toLowerCase(),
                container: metaData.format.container.toLowerCase(),
                frequency: metaData.format.sampleRate,
                channel: metaData.format.numberOfChannels,
                lossless: metaData.format.lossless,
                filesize: songStat.size
              },
              song_tag: {
                title: metaData.common.title,
                comment: metaData.common.comment ? metaData.common.comment.join('\n') : '',
                album: metaData.common.album,
                album_artist: metaData.common.album_artist || metaData.common.artist,
                artist: metaData.common.artist,
                disc: metaData.common.disk ? metaData.common.disk.no || '0' : '0',
                track: metaData.common.track ? metaData.common.track.no || '0' : '0',
                year: metaData.common.year
              }
            },
            title: metaData.common.title,
            artist: metaData.common.artist || artist,
            album: metaData.common.album || album,
            artistFolder: artist,
            albumFolder: album,
            songFile: songFile,
            hasImage: metaData.common.picture && metaData.common.picture.length > 0
          }
          if (!song.additional.song_tag.title) {
            song.additional.song_tag.title = song.songFile.replace('.mp3', '').replace('.flac', '')
            const parts = song.additional.song_tag.title.split(' ')
            try {
              if (parseInt(parts[0], 10) > 0) {
                parts.shift()
              }
            } catch (error) {
            }
          }
          for (const field of ['artist', 'genre', 'composer']) {
            let nameList = (metaData.common[field + 's'] || metaData.common[field] || '')
            if (nameList.join) {
              nameList = nameList.join(',').trim()
            }
            if (!nameList.length) {
              song.additional.song_tag[field] = ''
              continue
            }
            nameList = nameList.split(' and ').join(',').split(';').join(',').split(' ,').join(',').split(' & ').join(',').split('/').join(',')
            const array = nameList.split(',')
            song[field + 's'] = []
            for (const i in array) {
              song[field + 's'][i] = array[i].trim()
            }
            if (song[field + 's'].length > 1) {
              song[field + 's'] = song[field + 's'].join(',')
            } else {
              song[field + 's'] = song[field + 's'][0]
            }
            song.additional.song_tag[field] = song[field + 's'] || ''
          }
          songs.push(song)
        }
      }
    }
  }
  return found
}
