# API documentation

The Synology API for Audio Station is a combination of routes from Synology's DSM operating system and Audio Station.

## NodeJS index

## Index

| State | Value |
|-------|-------|
| mimic | Open Audio Server serves a response copied from Synology |
| equivalent | Open Audio Server generates the same response Synology would |
| pending | Open Audio Server did nothing but replied with success |

| URL                                                                                                                   | State      |
|-----------------------------------------------------------------------------------------------------------------------|------------|
| [/webapi/AudioStation/album.cgi](#webapiaudiostationalbumcgi)                                                         | equivalent |
| [/webapi/AudioStation/artist.cgi](#webapiaudiostationartistcgi)                                                       | equivalent |
| [/webapi/AudioStation/composer.cgi](#webapiaudiostationcomposercgi)                                                   | equivalent |
| [/webapi/AudioStation/cover.cgi](#webapiaudiostationcovercgi)                                                         | equivalent |
| [/webapi/AudioStation/genre.cgi](#webapiaudiostationgenrecgi)                                                         | equivalent |
| [/webapi/AudioStation/lyrics_search.cgi](#webapiaudiostationlyrics_searchcgi)                                         | pending    |
| [/webapi/AudioStation/lyrics.cgi](#webapiaudiostationlyricscgi)                                                       | pending    |
| [/webapi/AudioStation/pinlist.cgi](#webapiaudiostationpinlistcgi)                                                     | equivalent |
| [/webapi/AudioStation/playlist.cgi](#webapiaudiostationplaylistcgi)                                                   | equivalent |
| [/webapi/AudioStation/proxy.cgi](#webapiaudiostationproxycgi)                                                         | equivalent |
| [/webapi/AudioStation/radio.cgi](#webapiaudiostationradiocgi)                                                         | equivalent |
| [/webapi/AudioStation/remote_player_status.cgi](#webapiaudiostationremote_player_statuscgi)                           | equivalent |
| [/webapi/AudioStation/remote_player.cgi](#webapiaudiostationremote_playercgi)                                         | equivalent |
| [/webapi/AudioStation/search.cgi](#webapiaudiostationsearchcgi)                                                       | equivalent |
| [/webapi/AudioStation/song.cgi](#webapiaudiostationsongcgi)                                                           | equivalent |
| [/webapi/AudioStation/stream.cgi](#webapiaudiostationstreamcgi)                                                       | equivalent |
| [/webapi/AudioStation/web_player.cgi](#webapiaudiostationweb_playercgi)                                               | equivalent |
| [/webman/3rdparty/AudioStation/tagEditorUI/tag_editor.cgi](#webman3rdpartyaudiostationtageditoruitag_editorcgi)       | equivalent |
| [/webman/3rdparty/AudioStation/webUI/audio_search_lyrics.cgi](#webman3rdpartyaudiostationwebuiaudio_search_lyricscgi) | pending    |
| /webapi/AudioStation/info.cgi                                                                                         | mimic      |
| /webapi/auth.cgi                                                                                                      | mimic      |
| /webapi/encryption.cgi                                                                                                | mimic      |
| /webapi/entry.cgi                                                                                                     | mimic      |
| /webapi/query.cgi                                                                                                     | mimic      |
| /webman/login.cgi                                                                                                     | mimic      |
| /webman/security.cgi                                                                                                  | mimic      |

## /webapi/AudioStation/album.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of albums

    NODEJS await openAudioServer.Album.listAlbums({
      composer: <string>
      artist: <string>
      genre: <string>
      keyword: <string>
      sort_by: <string>
      sort_direction: <string>
      offset: <integer>
      limit: <integer>
    })

    POST REQUEST /webapi/AudioStation/album.cgi
    action=list&composer=&artist=&genre=&keyword=&sort_by=&sort_direction=&offset=&limit=

    JSON RESPONSE {
      data: {
        albums: [{
          album: <string>
          artist: <string>
          display_artist: <string>
          composer: <string>
          genre: <string>
          path: <string>
          album_artist: <string>
          comment: <string>
          title: <string>
          name: <string>
          year: <integer>
          created: <integer>
          additional: {
            rating: <integer>
          }
        }]
        offset
      }
      success: <boolean>
    }

[Top of page](#index)    

## /webapi/AudioStation/artist.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of artists

    NodeJS await openAudioServer.Artist.listArtists({
      composer: <string>
      artist: <string>
      genre: <string>
      keyword: <string>
      sort_by: <string>
      sort_direction: <string>
      offset: <integer>
      limit: <integer>
     })

    POST REQUEST /webapi/AudioStation/artist.cgi
    action=list&genre=&keyword=&sort_by=&sort_direction=&offset=&limit=

    JSON RESPONSE {
      data: {
        artists: [{
          name: <string>
          title: <string>
          additional: {
            avg_rating: <integer>
          }
        }]
        offset
      }
      success: <boolean>
    }

[Top of page](#index)

## /webapi/AudioStation/composer.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of composers

    NODEJS await openAudioServer.Composer.listComposers({
      composer: <string>
      artist: <string>
      genre: <string>
      keyword: <string>
      sort_by: <string>
      sort_direction: <string>
      offset: <integer>
      limit: <integer>
    })

    POST REQUEST /webapi/AudioStation/composer.cgi
    action=list&genre=&keyword=&sort_by=&sort_direction=&offset=&limit=

    JSON RESPONSE {
      data: {
        composers: [{
          name: <string>
          title: <string>
          additional: {
            avg_rating: <integer>
          }
        }]
        offset
      }
      success: <boolean>
    }

[Top of page](#index)

## /webapi/AudioStation/cover.cgi

This URL returns the first cover art encountered in a song within the artist or album, or the Audio Station default cover image.

### Retrieve cover art

    NODEJS await openAudioServer.Cover.coverImage({ 
      id: <string>,
      album_name: <string>,
      artist_name: <string>
    })

    GET REQUEST /webapi/AudioStation/cover.cgi
    action=getcover&id=&artist_name=&album_name=

    IMAGE RESPONSE

### Retrieves list of albums

## /webapi/AudioStation/genre.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of genres

    NODEJS await openAudioServer.Genre.listGenres({ 
      composer: <string>
      artist: <string>
      genre: <string>
      keyword: <string>
      sort_by: <string>
      sort_direction: <string>
      offset: <integer>
      limit: <integer>
    })

    POST REQUEST /webapi/AudioStation/genre.cgi
    action=list&genre=&keyword=&sort_by=&sort_direction=&offset=&limit

    JSON RESPONSE {
      data: {
        genres: [{
          name: <string>
          title: <string>
          additional: {
            avg_rating: <integer>
          }
        }]
        offset
      }
      success: <boolean>
    }

[Top of page](#index)

### /webapi/AudioStation/lyrics_search.cgi

This URL is pending implementation in Open Audio Server. It doesn't do anything yet, but will return a successful response message.

[Top of page](#index)

### /webapi/AudioStation/lyrics.cgi

This URL is pending implementation in Open Audio Server. It doesn't do anything yet, but will return a successful response message.

[Top of page](#index)

### /webapi/AudioStation/pinlist.cgi

This URL is used to create pinned items, rename, reorder, and unpin them.

[Top of page](#index)

### Create a pinned item

    NodeJS await openAudioServer.Pin.pinItem({
      items: [{
        genre: <string>
        composer: <string>
        artist: <string>
        folder: <string>
      }]
    })

    POST REQUEST /webapi/AudioStation/pinlist.cgi
    method=pin&items=<string of json> [{
      genre: <string>
      composer: <string>
      artist: <string>
      folder: <string>
    }]

    JSON RESPONSE {
      data: {
        items: [{
          id: <string>
          name: <string>
        }]
        offset
      }
      success: <boolean>
    }

[Top of page](#index)

### Reorder pinned items

    NODEJS await openAudioServer.Pin.reorderPinnedItems({ 
      items: [{
        id: <string>
        name: <string>
      }]
    })

    POST REQUEST /webapi/AudioStation/pinlist.cgi
    method=reorder&items=<string of json> [{
        id: <string>
        name: <string>
      }]

    JSON RESPONSE {
      data: {
        items: [{
          id: <string>
          name: <string>
        }]
      }
      success: <boolean>
    }

[Top of page](#index)

### Rename a pinned item

    NODEJS await openAudioServer.Pin.reorderPinnedItems({ 
      name: <string>
      items: [{
        id: <string>
      }] 
    })

    POST REQUEST /webapi/AudioStation/pinlist.cgi
    method=rename&name=&items=<string of json> [{
        id: <string>
        name: <string>
      }]

   JSON RESPONSE {
      data: {
        items: [{
          id: <string>
          name: <string>
        }]
      }
      success: <boolean>
    }

[Top of page](#index)

### Unpin an item

This URL returns your updated pin list.

    NODEJS await openAudioServer.Pin.unpinItem({ 
      items: <string> "id,id,id"
      })

    POST REQUEST /webapi/AudioStation/pinlist.cgi
    method=unpin&items=<string of json> [{
        id: <string>,
        name: <sting>
      }]

   JSON RESPONSE {
      data: {
        items: [{
          id: <string>
          name: <string>
        }]
      }
      success: <boolean>
    }

[Top of page](#index)

### List pinned items

    NODEJS await openAudioServer.Pin.listPinnedItems()

    POST REQUEST /webapi/AudioStation/pinlist.cgi
    method=list

    JSON RESPONSE {
      data: {
        items: [{
          id: <string>
          name: <string>
        }]
      }
      success: <boolean>
    }

[Top of page](#index)

## /webapi/AudioStation/playlist.cgi

This URL is used to create, update, delete and list 'normal' and 'smart' playlists.

### Creating 'normal' playlists

The 'normal' playlists contain songs that you add to them.

    NODEJS await openAudioServer.PlayList.createNormalPlayList({ 
      name: <string>
    })

    POST REQUEST /webapi/AudioStation/playlist.cgi
    method=create&name=

    JSON RESPONSE {
      data: {
        playlists: [{
          id: <string>
        }]
      }
      total: <integer>
      success: <boolean>
    }

[Top of page](#index)

### Creating 'smart' playlists

The 'smart' playlists apply your rules to generate a list of songs.

    NODEJS await openAudioServer.PlayList.createSmartPlayList({
      new_name: <string>
      conj_rule: <string> and|or,
      rules_json: [{
        tag: <integer>
        op: <integer>
        interval: <integer>
        tagval: <string>
      }]
     })

    POST REQUEST /webapi/AudioStation/playlist.cgi
    method=createsmart&name=&conj_rule=and|or&rules_json=<string of json> [{
        tag: <integer>
        op: <integer>
        tagval: <string>
        interval: <integer>
      }]

    JSON RESPONSE {
      data: {
        playlists: [{
          id: <string>
        }]
      }
      success: <boolean>
    }

[Top of page](#index)

### Renaming playlists

    NODEJS await openAudioServer.PlayList.renamePlayList({
      id: <string>
      new_name: <string>
    })

    POST REQUEST /webapi/AudioStation/playlist.cgi
    method=rename&id=&new_name=

    JSON RESPONSE {
      data: {
        playlists: [{
          id: <string>
        }]
      }
      total: <integer>
      success: <boolean>
    }

[Top of page](#index)

### Adding songs to 'normal' playlists

Playlists can receive a single song, a group of songs, album, artist, composer or genre.

    NODEJS await openAudioServer.PlayList.addTrackToNormalPlayList({
      id: <string>
      album: <string>
      artist: <string>
      composer: <string>
    })

    POST REQUEST /webapi/AudioStation/playlist.cgi
    method=add_track&id=&album=&artist=&composer=&genre=

    JSON RESPONSE {
      data: { 
        id: <string>
      } 
      success: <boolean>
    }

[Top of page](#index)

### Updating 'smart' playlists

    NODEJS await openAudioServer.PlayList.createSmartPlayList({ 
      new_name: <string>
      conj_rule: <string> and|or,
      rules_json: [{
        tag: <integer>
        op: <integer>
        interval: <integer>
        tagval: <string>
      }]
    })

    POST REQUEST /webapi/AudioStation/playlist.cgi
    method=updatesmart&id=&new_name=&conj_rule=and|or&rules_json=<string of json> [{
        tag: <integer>
        op: <integer>
        interval: <integer>
        tagval: <string>
      }]

    JSON RESPONSE {
      data: {
        playlists: [{
          id: <string>
        }]
      }
      success: <boolean>
    }

[Top of page](#index)

### Deleting playlists

    NODeJS await openAudioServer.PlayList.deletePlayList({ 
      id: <string> 
    })

    POST REQUEST /webapi/AudioStation/playlist.cgi
    method=delete&id=

    JSON RESPONSE {
      success: <boolean>
    }

[Top of page](#index)

### Listing playlists

This result is paginated, but not filtered or sorted.

    NODEJS await openAudioServer.PlayList.listPlayLists()

    POST REQUEST /webapi/AudioStation/playlist.cgi
    method=list

    JSON RESPONSE {
      data: {
        playlists: [{
          id: <string>
          name: <string>
          library: <string>
          type: <string> normal|smart,
          sharing_status: <string>
          additional: {
            sharing_info: {
              date_available: <string>
              date_expired: <string>
              id: <string>
              status: <string>
              url: <string>
            }
            rules: [{
              tag: <integer>
              op: <integer>
              tagval: <string>
              interval: <integer>
            }]
            rules_conjunction: <string> and|or
          }
          songs: [{
            title: <string>
            artist: <string>
            album: <string>
            additional: {
              song_audio: {
                duration: <integer>
                bitrate: <integer>
                codec: <string>
                container: <string>
                frequency: <integer>
                channel: <integer>
                lossless: true,
                filesize: <integer>
              }
              song_tag: {
                title: <string>
                comment: <string>
                album: <string>
                album_artist: <string>
                artist: <string>
                disc: <integer>
                track: <integer>
                year: <integer>
              }
              song_rating: {
                rating: <integer>
              }
            }
          }]
          songs_offset: <integer>
          songs_total: <integer>
        }]
      }
      total: <integer>
      success: <boolean>
    }

[Top of page](#index)

### Get a playlist

    NODEJS await openAudioServer.PlayList.getPlayList({ 
      id: <string> 
    })

    POST REQUEST /webapi/AudioStation/playlist.cgi
    method=getinfo&id=

    JSON RESPONSE {
      data: {
        playlists: [{
          id: <string>
          name: <string>
          library: <string>
          type: <string> normal|smart,
          sharing_status: <string>
          additional: {
            sharing_info: {
              date_available: <integer>
              date_expired: <integer>
              id: <string>
              status: <string>
              url: <string>
            }
            rules: <integer>
              tag: <integer>
              op: <integer>
              interval: <integer>
              tagval: <string>
            }]
            rules_conjunction: <string> and|or
          }
        }]
      }
      total: <integer>
      success: <boolean>
    }

[Top of page](#index)

## /webapi/AudioStation/proxy.cgi

This URL is used to stream and view track information of SHOUTcast radio stations.

### Get stream current track information

    NODEJS await openAudioServer.Proxy.getStreamTrackInformation({ 
      stream_id: <string> 
    })

    GET REQUEST /webapi/AudioStation/proxy.cgi 
    method=getsonginfo&stream_id=

    JSON RESPONSE { 
      data: { 
        title: <string>
      }
      success: <boolean> 
    }

[Top of page](#index)

### Stream a radio station

    NODEJS await openAudioServer.Proxy.startStream({
      id: <string>
    })

    POST REQUEST /webapi/AudioStation/proxy.cgi 
    method=getstreamid&id= 

    JSON RESPONSE {
        data: {
          format: <string>
          stream_id: <string>
        }
        success: <boolean>
      }

[Top of page](#index)

### Stop a stream

    NODEJS await openAudioServer.Proxy.deleteStream({
      stream_id: <string>
    })

    POST REQUEST /webapi/AudioStation/proxy.cgi
    method=deletesonginfo&stream_id=

    JSON RESPONSE { 
      success: <boolean> 
    }

[Top of page](#index)

## /webapi/AudioStation/radio.cgi

This URL is used to add and update personal and favorite radio stations, list radio stations, list SHOUTcast genres, and list stations within genres.

### Add a personal or favorite radio station

    NODEJS await openAudioServer.Radio.addStation({
      container: <string> Favorite|UserDefined
      offset: <integer>
      items: [{
        url: <string>
        title: <string>
        desc: <string>
      }]
    })

    POST REQUEST /webapi/AudioStation/radio.cgi
    method=add&container=Favorite|UserDefined&url=&title=&desc=

    JSON RESPONSE {
      success: <boolean>
    }

[Top of page](#index)

### Update an added or favorite radio station

The offset is the position of the item in the station list.

    NODEJS await openAudioServer.Radio.updateStation({
      container: <string> Favorite|UserDefined,
      offset: <integer>
      items: [{
        url: <string>
        title: <string>
        desc: <string>
      }]
    })

    POST REQUEST /webapi/AudioStation/radio.cgi
    method=updateradio&container=Favorite|UserDefined&offset=1&items=<string of json> [{
      url: <string>
      title: <string>
      desc: <string>
    }]

    JSON RESPONSE {
      success: <boolean>
    }

[Top of page](#index)
  
### List added radio stations

    NODEJS await openAudioServer.Radio.listAddedStations()

    POST REQUEST /webapi/AudioStation/radio.cgi
    method=list&container=UserDefined
  
    JSON RESPONSE {
      data: {
        radios: [{
          id: <string>
          title: <string>
          type: <string>
          url: <string>
        }]
      }
      success: <boolean>
    }
 
 [Top of page](#index)

 ### List favorite radio stations

    NODEJS await openAudioServer.Radio.listFavoriteStations()

    POST REQUEST /webapi/AudioStation/radio.cgi
    method=list&container=Favorite
  
    JSON RESPONSE {
      data: {
        radios: [{
          id: <string>
          title: <string>
          type: <string>
          url: <string>
        }]
      }
      success: <boolean>
    }
 
 [Top of page](#index)

### List SHOUTcast genres

    NODEJS await openAudioServer.Radio.listSHOUTCastGenreStations()

    POST REQUEST /webapi/AudioStation/radio.cgi
    method=list&container=SHOUTcast
  
    JSON RESPONSE {
      data: {
        radios: [{
          id: <string>
          title: <string>
          type: <string>
          url: <string>
        }]
      }
      success: <boolean>
    }

[Top of page](#index)
 
### List SHOUTcast stations within genre

    NODEJS await openAudioServer.Radio.listSHOUTCastGenreStations({ 
      keyword: <string> 
    })

    POST REQUEST /webapi/AudioStation/radio.cgi
    method=list&container=SHOUTcast_genre_Name
  
    JSON RESPONSE {
      data: {
        radios: [{
          id: <string>
          title: <string>
          type: <string>
          url: <string>
        }]
      }
      success: <boolean>
    }

[Top of page](#index)

## /webapi/AudioStation/remote_player_status.cgi

This URL returns the current track information from the playing stream.

### Get current playing track information

    NODEJS await openAudioServer.RemotePlayer.getPlaybackInformation()

    GET REQUEST /webapi/AudioStation/remote_player_status.cgi
    method=list&container=SHOUTcast_genre_Name
  
    JSON RESPONSE {
      data: {
        radios: [{
          id: <string>
          title: <string>
          type: <string>
          url: <string>
        }]
      }
      success: <boolean>
    }

## /webapi/AudioStation/remote_player.cgi

This URL queues and controls music playing on the computer running Open Audio Server.

### List playback devices

    NODEJS await openAudioServer.RemotePlayer.listPlaybackDevices()

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=list
  
    JSON RESPONSE {
    data: {
      players: [{
        id: <string>,
        is_multiple: <boolean>,
        name: <string>,
        password_protected: <boolean>,
        support_seek: <boolean>,
        support_set_volume: <boolean>,
        type: <string>
      }]
    },
    success: <boolean>
  }

### Get the remote queue

    NODEJS await openAudioServer.RemotePlayer.getQueue()

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=getplaylist
  
    JSON RESPONSE {
    data: {
      current: <integer>
      mode: <string>
      shuffle: <integer>
      total: <integer>
      timestamp: <integer>
      songs: []
    },
    success: <boolean>
  }

### Update the remote queue

    NODEJS await openAudioServer.RemotePlayer.updateQueue({
      songs: <string> 
      containers_json: <string>
      updated_index: <boolean>
    })

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=updateplaylist&songs=&containers_json=&updated_index=
  
    JSON RESPONSE {
      success: <boolean>
    }

`updated_index` will change song order.

`songs` may be:

- an empty string; the queue will clear.

- a radio station id; that station will be added.

- a comma-delimited string of songids, the songs will be added.

`containers_json` may be:

- a folder

- an album

- an artist

- a composer

- a genre

- a normal or smart playlist

### Start remote playback

    NODEJS await openAudioServer.RemotePlayer.play()

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=control&action=play
  
    JSON RESPONSE {
      success: <boolean>
    }

### Stop remote playback

    NODEJS await openAudioServer.RemotePlayer.stop()

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=control&action=stop
  
    JSON RESPONSE {
      success: <boolean>
    }

### Play next remote track

    NODEJS await openAudioServer.RemotePlayer.next()

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=control&action=next
  
    JSON RESPONSE {
      success: <boolean>
    }

### Play previous remote track

    NODEJS await openAudioServer.RemotePlayer.prev()

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=control&action=prev
  
    JSON RESPONSE {
      success: <boolean>
    }

### Set remote volume

    NODEJS await openAudioServer.RemotePlayer.setVolume({
      value: <integer> 1 - 100
    })

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=control&action=set_volume&value=
  
    JSON RESPONSE {
      success: <boolean>
    }

## /webapi/AudioStation/search.cgi

This URL receives a keyword and searches your library for albums, artists and songs containing that word.

### Searching songs, artists and albums

    NODEJS await openAudioServer.Search.searchLibrary({ 
      keyword: <string> 
    })

    POST REQUEST /webapi/AudioStation/search.cgi
    keyword=

    JSON RESPONSE {
      data: {
        albums: [{
          album: <string>
          artist: <string>
          display_artist: <string>
          composer: <string>
          genre: <string>
          path: <string>
          album_artist: <string>
          comment: <string>
          title: <string>
          name: <string>
          year: <integer>
          created: <integer>
          additional: {
            rating: <integer>
          }
        }]
        albumTotal: <integer>
        artists: [{
          name: <string>
          title: <string>
          additional: {
            avg_rating: <integer>
          }
        }]
        artistTotal: <integer>
        songs: [{
          title: <string>
          artist: <string>
          album: <string>
          additional: {
            song_audio: {
              duration: <integer>
              bitrate: <integer>
              codec: <string>
              container: <string>
              frequency: <integer>
              channel: <integer>
              lossless: <boolean>
              filesize: <integer>
            }
            song_tag: {
              title: <string>
              comment: <string>
              album: <string>
              album_artist: <string>
              artist: <string>
              disc: <integer>
              track: <integer>
              year: <integer>
            }
            song_rating: {
              rating: <integer>
            }
          }
        }]
        songTotal: 1
      }
      success: <boolean>
    }

[Top of page](#index)

## /webapi/AudioStation/song.cgi

This URL is used to update song ratings and list songs.  This URL is paginated, sortable, and filters results with optional field(s).

### Setting a song rating

    NODEJS await openAudioServer.Song.setRating({ 
      id: <string> 
      rating: <integer>
    })

    POST REQUEST /webapi/AudioStation/song.cgi
    method=setrating&rating=3

    JSON RESPONSE {
      data: {
        songs: [{
          title: <string>
          artist: <string>
          album: <string>
          additional: {
            song_audio: {
              duration: <integer>
              bitrate: <integer>
              codec: <string>
              container: <string>
              frequency: <integer>
              channel: <integer>
              lossless: <boolean>
              filesize: <integer>
            }
            song_tag: {
              title: <string>
              comment: <string>
              album: <string>
              album_artist: <string>
              artist: <string>
              disc: <integer>
              track: <integer>
              year: <integer>
            }
            song_rating: {
              rating: <integer>
            }
          }
        }]
      total: <integer>
      success: <boolean>
    }

[Top of page](#index)

### Retrieve a list of songs

    NodeJS await openAudioServer.Song.listSongs({ 
      id: <string>
      album: <string>
      composer: <string>
      genre: <string>
      artist: <string>
      sort_by: <string>
      sort_direction: <string>
      offset: <integer>
      limit: <integer>
    })

    POST REQUEST /webapi/AudioStation/song.cgi
    method=list&album=&composer=&genre=&artist=&sort_by=&sort_direction=&offset=&limit=

    JSON RESPONSE {
      data: {
        songs: [{
          title: <string>
          artist: <string>
          album: <string>
          additional: {
            song_audio: {
              duration: <integer>
              bitrate: <integer>
              codec: <string>
              container: <string>
              frequency: <integer>
              channel: <integer>
              lossless: <boolean>
              filesize: <integer>
            }
            song_tag: {
              title: <string>
              comment: <string>
              album: <string>
              album_artist: <string>
              artist: <string>
              disc: <integer>
              track: <integer>
              year: <integer>
            }
            song_rating: {
              rating: <integer>
            }
          }
        }]
        offset: <integer>
      }
      success: <boolean>
    }

[Top of page](#index)

## /webapi/AudioStation/stream.cgi

This URL, accessed via `stream.cgi/0.mp3`, is used to stream or transcode-first an item from your library.

### Transcoding files

    NodeJS await openAudioServer.Stream.transcodeMP3({ 
      id: <string> 
    })

    GET REQUEST /webapi/AudioStation/stream.cgi
    method=transcode&id=

    RESPONSE <song data>

[Top of page](#index)

### Streaming files

    NodeJS await openAudioServer.Stream.streamFile({ 
      id: <string> 
    })

    GET REQUEST /webapi/AudioStation/stream.cgi
    method=stream&id=

    RESPONSE <song data>

[Top of page](#index)

## /webapi/AudioStation/web_player.cgi

This URL queues the music playing in your web browser or smartphone.

### Get the web queue

    NODEJS await openAudioServer.WebPlayer.getQueue()

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=getplaylist
  
    JSON RESPONSE {
    data: {
      current: <integer>
      mode: <string>
      shuffle: <integer>
      total: <integer>
      timestamp: <integer>
      songs: []
    },
    success: <boolean>
  }

### Update the web queue

    NODEJS await openAudioServer.WebPlayer.updateQueue({
      songs: <string> 
      containers_json: <string>
      updated_index: <boolean>
    })

    POST REQUEST /webapi/AudioStation/remote_player.cgi
    method=updateplaylist&songs=&containers_json=&updated_index=
  
    JSON RESPONSE {
      success: <boolean>
    }

`updated_index` will change song order.

`songs` may be:

- an empty string; the queue will clear.

- a radio station id; that station will be added.

- a comma-delimited string of songids, the songs will be added.

`containers_json` may be:

- a folder

- an album

- an artist

- a composer

- a genre

- a normal or smart playlist

## /webman/3rdparty/AudioStation/tagEditorUI/tag_editor.cgi

This URL retrieves and updates song file information.

### Retrieve tag information

    NodeJS await openAudioServer.Song.getTag({ 
      audioInfos: [{
        path: <string>
      }] 
    })

    POST REQUEST /webman/3rdparty/AudioStation/tagEditorUI/tag_editor.cgi
    action=load

    JSON RESPONSE {
      files: [{
        album: <string>,
        artist: <string>,
        composer: <string>,
        genre: <string>,
        path: <string>,
        album_artist: <string>,
        comment: <string>,
        title: <string>,
        track: <integer>
        year: <integer>
        disc: <integer>
      }]
      lyrics: <string>
      read_fail_count: <integer>
      success: <boolean>
    }

`audioInfos` is an array of fully-qualified file paths to the requested song(s).

[Top of page](#index)

### Update tag information

    NodeJS await openAudioServer.Song.updateTag({ 
      audioInfos: [{
        path: <string>
      }]
      album: <string>,
      artist: <string>,
      composer: <string>,
      genre: <string>,
      path: <string>,
      album_artist: <string>,
      comment: <string>,
      title: <string>,
      track: <integer>
      year: <integer>
      disc: <integer>
    })

    POST REQUEST /webman/3rdparty/AudioStation/tagEditorUI/tag_editor.cgi
    action=apply&data=<string of json> {
      audioInfos: [{
        path: <string>
      }]
      album: <string>,
      artist: <string>,
      composer: <string>,
      genre: <string>,
      path: <string>,
      album_artist: <string>,
      comment: <string>,
      title: <string>,
      track: <integer>
      year: <integer>
      disc: <integer>
    }

    JSON RESPONSE {
      files: [{
        album: <string>,
        artist: <string>,
        composer: <string>,
        genre: <string>,
        path: <string>,
        album_artist: <string>,
        comment: <string>,
        title: <string>,
        track: <integer>
        year: <integer>
        disc: <integer>
      }]
      read_fail_count: <integer>
      success: <boolean>
      write_fail_files: [<string>]
    }

`audioInfos` is an array of fully-qualified file paths to the requested song(s).

[Top of page](#index)

## /webman/3rdparty/AudioStation/webUI/audio_search_lyrics.cgi

This URL is pending implementation in Open Audio Server. It doesn't do anything yet, but will return a successful response message.

[Top of page](#index)
