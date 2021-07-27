const AudioStationLyricsSearchCGI = JSON.stringify(require('./lyrics_search.cgi.json'))

module.exports = (_, res) => {
  return res.end(AudioStationLyricsSearchCGI)
}
