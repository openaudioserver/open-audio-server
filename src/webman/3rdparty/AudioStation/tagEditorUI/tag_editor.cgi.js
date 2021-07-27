const library = require('../../../../../library.js')

module.exports = (_, res, postData) => {
  if (postData.action === 'load') {
    const info = JSON.parse(postData.audioInfos)
    const song = library.songs.filter(song => song.path === info[0].path)[0]
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
    const tagEditorResponse = {
      files: [
        {
          album: song.album,
          artist: songArtists.join(', '),
          composer: songComposers.join(', '),
          genre: songGenres.join(', '),
          path: song.path,
          album_artist: song.additional.song_tag.album_artist || '',
          comment: song.additional.song_tag.comment || '',
          title: song.additional.song_tag.title || '',
          track: song.additional.song_tag.track || '',
          year: song.additional.song_tag.year || '',
          disc: song.additional.song_tag.disc || ''
        }
      ],
      lyrics: '',
      read_fail_count: 0,
      success: true
    }
    return res.end(JSON.stringify(tagEditorResponse))
  } else if (postData.action === 'apply') {
    const data = JSON.parse(postData.data)
    const song = library.songs.filter(song => song.path === data[0].audioInfos[0].path)[0]
    library.songEdits[song.path] = {
      album: data[0].album,
      title: data[0].title,
      artist: data[0].artist,
      album_artist: data[0].album_artist,
      composer: data[0].composer,
      comment: data[0].comment,
      genre: data[0].genre,
      track: data[0].track ? parseInt(data[0].track, 10) : undefined,
      disc: data[0].disc ? parseInt(data[0].disc, 10) : undefined,
      year: data[0].year ? parseInt(data[0].year, 10) : undefined
    }
    library.rewriteEdits()
    return res.end(JSON.stringify({
      files: data[0].audioInfos,
      read_fail_count: 0,
      success: true,
      write_fail_files: []
    }))
  }
}
