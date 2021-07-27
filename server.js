const fs = require('fs')
const http = require('http')
const path = require('path')
const querystring = require('querystring')
const statCache = {}
const bufferCache = {}
const existsCache = {}

const server = http.createServer(receiveRequest)
server.listen(process.env.PORT || 5000, process.env.HOST || 'localhost')
const library = require('./library.js')
library.load()
const scanner = require('./scanner.js')
scanner.start()

if (!process.env.SYNOMAN_PATH) {
  console.log('*** warning SYNOMAN_PATH is not defined, only the mobile apps will function')
} else if (!fs.existsSync(process.env.SYNOMAN_PATH)) {
  console.log('*** warning SYNOMAN_PATH does not exist, only the mobile apps will function')
}

if (!process.env.DSAUDIO_HTML_PATH) {
  console.log('*** warning DSAUDIO_HTML_PATH is not defined, only the mobile apps will function')
} else if (!fs.existsSync(process.env.DSAUDIO_HTML_PATH)) {
  console.log('*** warning DSAUDIO_HTML_PATH does not exist, only the mobile apps will function')
}

if (!process.env.MUSIC_PATH) {
  console.log('*** warning MUSIC_PATH is not defined, your library will be empty')
} else if (!fs.existsSync(process.env.MUSIC_PATH)) {
  console.log('*** warning MUSIC_PATH does not exist, your library will be empty')
}

if (!process.env.CACHE_PATH) {
  console.log('*** warning CACHE_PATH is not defined, your song index, ratings etc will not save')
} else if (!fs.existsSync(process.env.CACHE_PATH)) {
  console.log('*** warning CACHE_PATH does not exist, your song index, ratings etc will not save')
}

function receiveRequest (req, res) {
  if (req.url === '/scan') {
    scanner.start(true)
    return res.end('Scanning music library at ' + process.env.MUSIC_PATH)
  }
  if (!req.headers.cookie || req.headers.cookie.indexOf('smid=') === -1) {
    res.setHeader('set-cookie', 'smid=E9GRXinHCOWZrGINa_VJPiuzMjMWLwkXyJCJT8z_pZ7KZ8Jf7vdLq9vxSf4zpJ7lQAWaO6WOHOZYkVfAnziPPg; stay_login=1; id=ap0hulniOX5f.1130LWN011720')
  }
  if (req.url === '/') {
    const dsAudioHTMLPath = process.env.DSAUDIO_HTML_PATH
    const dsAudioHTMLPathExists = existsCache[dsAudioHTMLPath] = existsCache[dsAudioHTMLPath] || (dsAudioHTMLPath && fs.existsSync(dsAudioHTMLPath))
    if (dsAudioHTMLPathExists) {
      res.writeHead(302, {
        location: '/dsaudio?launchApp=SYNO.SDS.AudioStation.Application'
      })
      return res.end()
    } else {
      const setupFilePath = path.join(__dirname, 'setup.html')
      const setupFilePathExists = existsCache[setupFilePath] = existsCache[setupFilePath] || (dsAudioHTMLPath && fs.existsSync(setupFilePath))
      if (setupFilePathExists) {
        const buffer = bufferCache[setupFilePath] = bufferCache[setupFilePath] || fs.readFileSync(setupFilePath)
        res.setHeader('content-type', 'text/html')
        return res.end(buffer)
      }
    }
  }
  const urlParts = req.url.split('?')
  const queryData = querystring.parse(urlParts[1])
  if (req.method === 'GET') {
    console.log('[request]', req.method, urlParts[0], 'query=', queryData ? Object.keys(queryData).join(',') : ' ')
    return executeRequest(req, res, {}, queryData)
  } else {
    let rawData = ''
    req.on('data', chunk => {
      rawData += chunk
    })
    req.on('end', () => {
      const postData = querystring.decode(rawData)
      console.log('[request]', req.method, urlParts[0], 'query=', queryData ? Object.keys(queryData).join(',') : ' ', 'posted=', postData ? Object.keys(postData).join(',') : ' ')
      return executeRequest(req, res, postData, queryData)
    })
  }
}

function executeRequest (req, res, postData, queryData) {
  res.statusCode = 200
  const urlParts = req.url.split('?')
  let urlPart = urlParts[0]
  if (urlPart.indexOf('.cgi/') > -1) {
    urlPart = urlPart.substring(0, urlPart.indexOf('.cgi/') + '.cgi'.length)
  }
  const sourcePath = path.join(__dirname, 'src', urlPart + '.js')
  const sourcePathExists = existsCache[sourcePath] = existsCache[sourcePath] || fs.existsSync(sourcePath)
  if (sourcePathExists) {
    return require(sourcePath)(req, res, postData, queryData)
  }
  let staticFilePath
  if (urlPart === '/dsaudio') {
    urlPart = 'dsaudio.html'
    staticFilePath = process.env.DSAUDIO_HTML_PATH
  } else if (!process.env.SYNOMAN_PATH) {
    staticFilePath = path.join(__dirname, urlPart)
  } else {
    staticFilePath = path.join(process.env.SYNOMAN_PATH, urlPart)
  }
  const staticFilePathExists = existsCache[staticFilePath] = existsCache[staticFilePath] || fs.existsSync(staticFilePath)
  if (staticFilePathExists) {
    const stat = statCache[staticFilePath] = statCache[staticFilePath] || fs.statSync(staticFilePath)
    if (!stat.isDirectory()) {
      if (urlPart.endsWith('.html')) {
        res.setHeader('content-type', 'text/html')
      } else if (urlPart.endsWith('.css')) {
        res.setHeader('content-type', 'text/css')
      } else if (urlPart.endsWith('.png')) {
        res.setHeader('content-type', 'image/png')
      } else if (urlPart.endsWith('.js')) {
        res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
      }
      let buffer = bufferCache[staticFilePath] = bufferCache[staticFilePath] || fs.readFileSync(staticFilePath)
      if (urlPart === 'dsaudio.html' && process.env.THEME_PATH) {
        const themeFilePath = process.env.THEME_PATH
        const themeFilePathExists = existsCache[themeFilePath] = existsCache[themeFilePath] || fs.existsSync(themeFilePath)
        if (themeFilePathExists) {
          const newCSS = fs.readFileSync(process.env.THEME_PATH).toString()
          if (newCSS && newCSS.length) {
            const newHTML = buffer.toString().replace('</head>', `<style>${newCSS}</style></head>`)
            buffer = Buffer.from(newHTML)
          }
        }
      }
      return res.end(buffer)
    }
  }
  // Files embeded in themes are mapped like this:
  // "theme.css" containing "background: url(image.png)"
  //   -> web request "/image.png"
  //   -> file request "/path/to/theme-folder/image.png"
  // Use a prefix to make sure you don't collide:
  // "theme.css" containing "background: url(theme-name/image.png)"
  //   -> web request "/theme-name/image.png"
  //   -> file request "/path/to/theme-folder/theme-name/image.png"
  if (process.env.THEME_PATH) {
    const themeFolder = process.env.THEME_PATH.substring(0, process.env.THEME_PATH.lastIndexOf('/'))
    const themeFilePath = path.join(themeFolder, urlPart)
    const themeFileExists = existsCache[themeFilePath] = existsCache[themeFilePath] || fs.existsSync(themeFilePath)
    if (themeFileExists) {
      if (urlPart.endsWith('.html')) {
        res.setHeader('content-type', 'text/html')
      } else if (urlPart.endsWith('.css')) {
        res.setHeader('content-type', 'text/css')
      } else if (urlPart.endsWith('.png')) {
        res.setHeader('content-type', 'image/png')
      } else if (urlPart.endsWith('.js')) {
        res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
      }
      const buffer = bufferCache[themeFilePath] = bufferCache[themeFilePath] || fs.readFileSync(themeFilePath)
      return res.end(buffer)
    }
  }
  res.statusCode = 404
  return res.end()
}
