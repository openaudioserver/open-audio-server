const openAudioServer = module.exports = {
  Album: require('./src/webapi/AudioStation/album.cgi.js'),
  Artist: require('./src/webapi/AudioStation/artist.cgi.js'),
  Composer: require('./src/webapi/AudioStation/composer.cgi.js'),
  Cover: require('./src/webapi/AudioStation/cover.cgi.js'),
  Folder: require('./src/webapi/AudioStation/folder.cgi.js'),
  Genre: require('./src/webapi/AudioStation/genre.cgi.js'),
  Lyrics: {},
  PinList: require('./src/webapi/AudioStation/pinlist.cgi.js'),
  PlayList: require('./src/webapi/AudioStation/playlist.cgi.js'),
  Proxy: require('./src/webapi/AudioStation/proxy.cgi.js'),
  Radio: require('./src/webapi/AudioStation/radio.cgi.js'),
  RemotePlayer: require('./src/webapi/AudioStation/remote_player.cgi.js'),
  Search: require('./src/webapi/AudioStation/search.cgi.js'),
  Song: require('./src/webapi/AudioStation/song.cgi.js'),
  Stream: require('./src/webapi/AudioStation/stream.cgi.js'),
  WebPlayer: require('./src/webapi/AudioStation/web_player.cgi.js'),
}

const remotePlayerStatus = require('./src/webapi/AudioStation/remote_player_status.cgi.js')
openAudioServer.RemotePlayer.getPlaybackInformation = remotePlayerStatus.getPlaybackInformation
