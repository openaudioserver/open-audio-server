const fs = require('fs')
const http = require('http')
const path = require('path')
const querystring = require('querystring')
const statCache = {}
const server = http.createServer(receiveRequest)
server.listen(process.env.PORT || 5000, process.env.HOST || 'localhost')
const library = require('./library.js')
library.load()
const scanner = require('./scanner.js')
scanner.start()

function receiveRequest (req, res) {
  if (!req.headers.cookie || req.headers.cookie.indexOf('smid=') === -1) {
    res.setHeader('set-cookie', 'smid=E9GRXinHCOWZrGINa_VJPiuzMjMWLwkXyJCJT8z_pZ7KZ8Jf7vdLq9vxSf4zpJ7lQAWaO6WOHOZYkVfAnziPPg; stay_login=1; id=ap0hulniOX5f.1130LWN011720')
  }
  if (req.url === '/') {
    res.writeHead(302, {
      location: '/dsaudio?launchApp=SYNO.SDS.AudioStation.Application'
    })
    return res.end()
  }
  const urlParts = req.url.split('?')
  const queryData = querystring.parse(urlParts[1])
  if (req.method === 'GET') {
    console.log(req.method, req.url, queryData)
    return executeRequest(req, res, {}, queryData)
  } else {
    let rawData = ''
    req.on('data', chunk => {
      rawData += chunk
    })
    req.on('end', () => {
      const postData = querystring.decode(rawData)
      console.log(req.method, req.url, queryData, postData)
      return executeRequest(req, res, postData, queryData)
    })
  }
}

function executeRequest (req, res, postData, queryData) {
  const urlParts = req.url.split('?')
  let urlPart = urlParts[0]
  if (urlPart.indexOf('.cgi/') > -1) {
    urlPart = urlPart.substring(0, urlPart.indexOf('.cgi/') + '.cgi'.length)
  }
  const sourcePath = path.join(__dirname, 'src', urlPart + '.js')
  if (fs.existsSync(sourcePath)) {
    return require(sourcePath)(req, res, postData, queryData)
  }
  if (urlPart === '/dsaudio') {
    urlPart = 'dsaudio.html'
  } else if (urlPart === '/scan') {
    scanner.start(true)
    return res.end('{ "success": true }')
  } else {
    urlPart = `synoman/${urlPart}`
  }
  const wwwFilePath = path.join(__dirname, urlPart)
  if (fs.existsSync(wwwFilePath)) {
    const stat = statCache[wwwFilePath] = statCache[wwwFilePath] || fs.statSync(wwwFilePath)
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
      let buffer = fs.readFileSync(wwwFilePath)
      if (urlPart === 'dsaudio.html' && process.env.THEME_PATH) {
        const newCSS = fs.readFileSync(process.env.THEME_PATH)
        const newHTML = buffer.toString().replace('</head>', `<style>${newCSS}</style></head>`)
        buffer = Buffer.from(newHTML)
      }
      return res.end(buffer)
    }
  }
  return res.end()
}
