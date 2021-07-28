const library = require('../../../library.js')

module.exports = {
  listContents,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await listContents(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listContents (options) {
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  const limit = options.limit ? parseInt(options.limit, 10) || 0 : 0
  const response = {
    data: {
      offset: offset || 0
    },
    success: true
  }
  if (options.id) {
    const folder = Object.values(library.folders).filter(folder => folder.id === options.id)[0]
    response.data.items = folder.items
    response.data.id = folder.id
  } else {
    if (!library.folders[process.env.MUSIC_PATH]) {
      response.data.items = []
      response.data.id = 'dir_1'
    } else {
      response.data.items = library.folders[process.env.MUSIC_PATH].items
      response.data.id = library.folders[process.env.MUSIC_PATH].id
    }
  }
  if (options.sort_by) {
    for (const integerField of ['duration', 'disc', 'year', 'track']) {
      if (options.sort_by === integerField) {
        response.data.items = response.data.items.sort((a, b) => {
          if (options.sort_direction === 'ASC') {
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
      if (options.sort_by === 'name' || options.sort_by === 'title') {
        response.data.items = response.data.items.sort((a, b) => {
          return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        })
      }
    }
  } else {
    response.data.items = response.data.items.sort((a, b) => {
      return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    })
  }
  response.data.total = response.data.items.length
  response.data.folder_total = response.data.items.filter(folder => folder.type === 'folder').length
  if (limit && response.data.items.length > limit) {
    response.data.items.length = limit
  }
  response.data.items = JSON.parse(JSON.stringify(response.data.items))
  const fields = ['genres', 'items', 'composers', 'artists', 'hasImage', 'albumFolder', 'artistFolder', 'songFile', 'artist', 'album']
  for (const item of response.data.items) {
    for (const field of fields) {
      delete (item[field])
    }
  }
  const folders = response.data.items.filter(item => item.type === 'folder')
  response.data.folder_total = folders && folders.length ? folders.length : 0
  return response
}
