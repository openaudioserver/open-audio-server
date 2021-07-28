const https = require('https')
const library = require('../../../library.js')
const util = require('util')

module.exports = {
  listAddedStations,
  listFavoriteStations,
  listSHOUTcastGenres,
  listSHOUTCastGenreStations,
  addStation,
  updateStation,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        if (postData.container === 'UserDefined') {
          response = listAddedStations()
        } else if (postData.container === 'Favorite') {
          response = listFavoriteStations()
        } else if (postData.container === 'SHOUTcast') {
          response = listSHOUTcastGenres()
        } else if (postData.container.startsWith('SHOUTcast_genre_')) {
          response = SHOUTcastGenreStationList(postData)
        }
        break
      case 'add':
        response = await addStation(postData)
        break
      case 'updateradio':
        response = await updateStation(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listAddedStations () {
  const response = {
    data: {
      radios: library.radios
    },
    success: true
  }
  response.data.total = response.data.radios.length
  return response
}

async function listFavoriteStations () {
  const response = {
    data: {
      radios: library.favoriteRadios
    },
    success: true
  }
  response.data.total = response.data.radios.length
  return response
}

async function listSHOUTcastGenres () {
  const response = {
    data: {
      radios: SHOUTcastGenreList
    },
    success: true
  }
  response.data.total = response.data.radios.length
  return response
}

async function listSHOUTCastGenreStations (options) {
  const genre = options.container.substring('SHOUTcast_genre_'.length)
  const response = {
    data: {
      radios: await SHOUTcastGenreStationList(genre)
    },
    success: true
  }
  response.data.total = response.data.radios.length
  return response
}

async function addStation (options) {
  if (options.container === 'Favorite') {
    library.favoriteRadios.push({
      desc: options.desc,
      title: options.title,
      type: 'station',
      url: options.url
    })
    library.rewriteFavoriteRadios()
  } else {
    library.radios.push({
      desc: options.desc,
      title: options.title,
      type: 'station',
      url: options.url
    })
    library.rewriteRadios()
  }
  return { success: true }
}

async function updateStation (options) {
  const offset = options.offset ? parseInt(options.offset, 10) || 0 : 0
  const newData = JSON.parse(options.radios_json)
  if (options.container === 'Favorite') {
    if (newData.length === 0) {
      library.favoriteRadios.splice(offset, 1)
    } else {
      const favorite = library.favoriteRadios[offset]
      favorite.title = newData.title
      favorite.desc = newData.desc
      favorite.url = newData.url
      favorite.id = `radio_${favorite.title} ${favorite.url}`
    }
    library.rewriteFavoriteRadios()
  } else {
    const radio = library.radios[offset]
    if (newData.length === 0) {
      library.radios.splice(offset, 1)
    } else {
      radio.title = newData.title
      radio.desc = newData.desc
      radio.url = newData.url
      radio.id = `radio_${radio.title} ${radio.url}`
    }
    library.rewriteRadios()
  }
  return { success: true }
}

const SHOUTcastGenreStationList = util.promisify((genre, callback) => {
  const data = `genrename=${genre}`
  const requestOptions = {
    hostname: 'directory.shoutcast.com',
    port: 443,
    path: '/Home/BrowseByGenre',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length': data.length,
      Cookie: 'ASP.NET_SessionId=asdfasdfasdljkfh',
      Referer: 'https://directory.shoutcast.com/',
      'User-Agent': 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0'
    }
  }
  const proxyRequest = https.request(requestOptions, proxyResponse => {
    let data
    proxyResponse.on('data', chunk => {
      if (!data) {
        data = chunk
      } else {
        data += chunk
      }
    })
    proxyResponse.on('end', () => {
      const response = {
        data: {
          radios: []
        },
        success: true
      }
      const radios = JSON.parse(data)
      if (radios && radios.length) {
        for (const item of radios) {
          const radio = {
            id: `radio_${item.Name} http://yp.shoutcast.com/sbin/tunein-station.pls?id=${item.ID}`,
            title: item.Name,
            type: 'station',
            url: `http://yp.shoutcast.com/sbin/tunein-station.pls?id=${item.ID}`
          }
          if (item.Format === 'audio/mpeg') {
            radio.desc = 'MP3 (' + item.Bitrate + ' kbps)'
          }
          response.data.radios.push(radio)
        }
      }
      response.data.total = response.data.radios.length
      return callback(response)
    })
  })
  proxyRequest.on('error', (error) => {
    console.log('radio error', error)
    const response = {
      success: false
    }
    return callback(null, response)
  })
  proxyRequest.write(data)
  return proxyRequest.end()
})

const SHOUTcastGenreList = {
  data: {
    offset: 0,
    radios: [
      {
        desc: '',
        id: 'SHOUTcast_genre_Alternative',
        title: 'Alternative',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Blues',
        title: 'Blues',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Classical',
        title: 'Classical',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Country',
        title: 'Country',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Decades',
        title: 'Decades',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Easy Listening',
        title: 'Easy Listening',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Electronic',
        title: 'Electronic',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Folk',
        title: 'Folk',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Hip Hop',
        title: 'Hip Hop',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Rap',
        title: 'Rap',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Inspirational',
        title: 'Inspirational',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_International',
        title: 'International',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_JPop',
        title: 'JPop',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Jazz',
        title: 'Jazz',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Latin',
        title: 'Latin',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Metal',
        title: 'Metal',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_New Age',
        title: 'New Age',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Pop',
        title: 'Pop',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_R&B',
        title: 'R&B',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Urban',
        title: 'Urban',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Reggae',
        title: 'Reggae',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Rock',
        title: 'Rock',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Holiday',
        title: 'Holiday',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Soundtracks',
        title: 'Soundtracks',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Talk',
        title: 'Talk',
        type: 'container',
        url: ''
      },
      {
        desc: '',
        id: 'SHOUTcast_genre_Themes',
        title: 'Themes',
        type: 'container',
        url: ''
      }
    ],
    total: 26
  },
  success: true
}
