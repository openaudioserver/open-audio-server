const https = require('https')
const library = require('../../../library.js')
const radioCGIJSON = require('./radio.cgi.json')

module.exports = (_, res, postData) => {
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  const offset = postData.offset ? parseInt(postData.offset, 10) || 0 : 0
  if (postData.method === 'add') {
    if (postData.container === 'Favorite') {
      library.favoriteRadios.push({
        desc: postData.desc,
        title: postData.title,
        type: 'station',
        url: postData.url
      })
      library.rewriteFavoriteRadios()
    } else {
      library.radios.push({
        desc: postData.desc,
        title: postData.title,
        type: 'station',
        url: postData.url
      })
      library.rewriteRadios()
    }
    return res.end('{ "success": true }')
  } else if (postData.method === 'updateradio') {
    const newData = JSON.parse(postData.radios_json)
    if (postData.container === 'Favorite') {
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
    return res.end('{ "success": true }')
  }
  if (postData.container === 'SHOUTcast') {
    return res.end(JSON.stringify(radioCGIJSON))
  } else if (postData.container && postData.container.startsWith('SHOUTcast_genre_')) {
    const data = `genrename=${postData.container.substring('SHOUTcast_genre_'.length)}`
    const options = {
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
    const proxyRequest = https.request(options, proxyResponse => {
      let data
      proxyResponse.on('data', chunk => {
        if (!data) {
          data = chunk
        } else {
          data += chunk
        }
      })
      proxyResponse.on('end', () => {
        const radioResponse = {
          data: {
            offset,
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
            radioResponse.data.radios.push(radio)
          }
        }
        radioResponse.data.total = radioResponse.data.radios.length
        return res.end(JSON.stringify(radioResponse))
      })
    })
    proxyRequest.on('error', _ => {
      const radioResponse = {
        success: false
      }
      return res.end(JSON.stringify(radioResponse))
    })
    proxyRequest.write(data)
    return proxyRequest.end()
  }
  const radioResponse = {
    data: {
      radios: postData.container === 'Favorite' ? library.favoriteRadios : library.radios
    },
    success: true
  }
  radioResponse.data.total = radioResponse.data.radios.length
  return res.end(JSON.stringify(radioResponse))
}
