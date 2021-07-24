const AudioStationLyricsSearchCGI = require('./lyrics_search.cgi.json')

module.exports = (_, res) => {
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  return res.end(JSON.stringify(AudioStationLyricsSearchCGI))
}
