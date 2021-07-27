const library = require('../../../library.js')

module.exports = (_, res, postData) => {
  const offset = postData.offset ? parseInt(postData.offset, 10) || 0 : 0
  const limit = postData.limit ? parseInt(postData.limit, 10) || 0 : 0
  const folderResponse = {
    data: {
      offset: offset || 0
    },
    success: true
  }
  if (postData.id) {
    const folder = Object.values(library.folders).filter(folder => folder.id === postData.id)[0]
    folderResponse.data.items = folder.items
    folderResponse.data.id = folder.id
  } else {
    if (!library.folders[process.env.MUSIC_PATH]) {
      folderResponse.data.items = []
      folderResponse.data.id = 'dir_1'
    } else {
      folderResponse.data.items = library.folders[process.env.MUSIC_PATH].items
      folderResponse.data.id = library.folders[process.env.MUSIC_PATH].id
    }
  }
  if (postData.sort_by) {
    for (const integerField of ['duration', 'disc', 'year', 'track']) {
      if (postData.sort_by === integerField) {
        folderResponse.data.items = folderResponse.data.items.sort((a, b) => {
          if (postData.sort_direction === 'ASC') {
            if (a.additional.song_audio[integerField]) {
              return a.additional.song_audio[integerField] > b.additional.song_audio[integerField] ? 1 : -1
            } else {
              return a.additional.song_tag[integerField] > b.additional.song_tag[integerField] ? 1 : -1
            }
          } else {
            if (a.additional.song_audio[integerField]) {
              return a.additional.song_audio[integerField] < b.additional.song_audio[integerField] ? 1 : -1
            } else {
              return a.additional.song_tag[integerField] < b.additional.song_tag[integerField] ? 1 : -1
            }
          }
        })
      }
      if (postData.sort_by === 'name' || postData.sort_by === 'title') {
        folderResponse.data.items = folderResponse.data.items.sort((a, b) => {
          return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        })
      }
    }
  } else {
    folderResponse.data.items = folderResponse.data.items.sort((a, b) => {
      return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    })
  }
  folderResponse.data.total = folderResponse.data.items.length
  folderResponse.data.folder_total = folderResponse.data.items.filter(folder => folder.type === 'folder').length
  if (limit && folderResponse.data.items.length > limit) {
    folderResponse.data.items.length = limit
  }
  folderResponse.data.items = JSON.parse(JSON.stringify(folderResponse.data.items))
  const fields = ['genres', 'items', 'composers', 'artists', 'hasImage', 'albumFolder', 'artistFolder', 'songFile', 'artist', 'album']
  for (const item of folderResponse.data.items) {
    for (const field of fields) {
      delete (item[field])
    }
  }
  const folders = folderResponse.data.items.filter(item => item.type === 'folder')
  folderResponse.data.folder_total = folders && folders.length ? folders.length : 0
  return res.end(JSON.stringify(folderResponse))
}
