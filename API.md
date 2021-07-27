# API documentation

The Synology API for Audio Station is a combination of routes from Synology's DSM operating system and Audio Station.

## Index

| State | Value |
|-------|-------|
| mimic | Open Audio Server serves a response copied from Synology |
| equivalent | Open Audio Server generates the same response Synology would |
| pending | Open Audio Server did nothing but replied with success |

| URL | State | Method | Parameters |
|-----|-------|--------|------------|
| /webman/login.cgi | mimic | POST | |
| /webman/security.cgi | mimic | POST | |
| [/webman/3rdparty/AudioStation/tagEditorUI/tag_editor.cgi](#webman3rdpartyaudiostationtageditoruitag_editorcgi) | equivalent | POST | action, data |
| [/webman/3rdparty/AudioStation/webUI/audio_search_lyrics.cgi](#webman3rdpartyaudiostationwebuiaudio_search_lyricscgi) | pending | POST | |
| /webapi/auth.cgi | mimic | POST | |
| /webapi/encryption.cgi | mimic | POST | |
| /webapi/entry.cgi | mimic | GET+POST | |
| /webapi/query.cgi | equivalent | POST | |
| [/webapi/AudioStation/album.cgi](#webapiaudiostationalbumcgi) | equivalent | POST | composer, artist, genre, keyword, sort_by, sort_direction, offset, limit |
| [/webapi/AudioStation/artist.cgi](#webapiaudiostationartistcgi) | equivalent | POST | genre, keyword, sort_by, sort_direction, offset, limit 
| [/webapi/AudioStation/composer.cgi](#webapiaudiostationcomposercgi) | equivalent | POST | keyword, sort_by, sort_direction, offset, limit |
| /webapi/AudioStation/cover.cgi | equivalent | GET | id, album_name, artist_name, composer_name, output_default, default_genre_name | 
| [/webapi/AudioStation/genre.cgi](#webapiaudiostationgenrecgi) | equivalent | POST | method, keyword, sort_sort_by, offset, limit |
| /webapi/AudioStation/info.cgi | mimic | POST | | 
| /webapi/AudioStation/lyrics_search.cgi | pending | POST | |
| /webapi/AudioStation/lyrics.cgi | pending | POST | |
| [/webapi/AudioStation/pinlist.cgi](#webapiaudiostationpinlistcgi) | equivalent | POST | method, items |
| [/webapi/AudioStation/playlist.cgi](#webapiaudiostationplaylistcgi) | equivalent | POST | method, name, new_name, songs, album, artist, composer, genre, id, rules_json |
| [/webapi/AudioStation/proxy.cgi](#webapiaudiostationproxycgi) | equivalent | GET | method, id, stream_id, |
| [/webapi/AudioStation/radio.cgi](#webapiaudiostationradiocgi) | equivalent | POST | method, container, url, title, desc, offset |
| /webapi/AudioStation/remote_player_status.cgi | equivalent | POST | |
| /webapi/AudioStation/remote_player.cgi | equivalent | POST | method, action, volume, value, songs, containers_json |
| [/webapi/AudioStation/search.cgi](#webapiaudiostationsearchcgi) | equivalent | POST | keyword |
| [/webapi/AudioStation/song.cgi](#webapiaudiostationsongcgi) | equivalent | POST | method, id, rating, album, composer, genre, artist, sort_by, sort_direction | 
| [/webapi/AudioStation/stream.cgi](#webapiaudiostationstreamcgi) | equivalent | GET | method, id | 
| /webapi/AudioStation/web_player.cgi | equivalent | POST | method, songs, updated_index, containers_json, offset |

## /webman/3rdparty/AudioStation/tagEditorUI/tag_editor.cgi

### Retrieve tag information

    POST
    action=load

    RESPONSE {
      files: [{
        album: 'album name',
        artist: 'artist name',
        composer: 'composer name',
        genre: 'genre value',
        path: 'song file path',
        album_artist: 'artist name',
        comment: 'comment value',
        title: 'song title',
        track: 'track number',
        year: 'year number',
        disc: 'disc number'
      }],
      lyrics: '',
      read_fail_count: 0,
      success: true
    }

### Update tag information

    POST
    action=apply
    &data=<string of json> {
      audioInfos: [{
        path
      }],
      album: 'album name',
      artist: 'artist name',
      composer: 'composer name',
      genre: 'genre value',
      path: 'song file path',
      album_artist: 'artist name',
      comment: 'comment value',
      title: 'song title',
      track: 'track number',
      year: 'year number',
      disc: 'disc number'
    }

    RESPONSE {
      files: [{
        album: 'album name',
        artist: 'artist name',
        composer: 'composer name',
        genre: 'genre value',
        path: 'song file path',
        album_artist: 'artist name',
        comment: 'comment value',
        title: 'song title',
        track: 'track number',
        year: 'year number',
        disc: 'disc number'
      }],
      read_fail_count: 0,
      success: true,
      write_fail_files: []
    }

[Top of page](#index)

## /webman/3rdparty/AudioStation/webUI/audio_search_lyrics.cgi

This URL is pending implementation in Open Audio Server. That means it returns a static, successful response message to all requests.

[Top of page](#index)

## /webapi/AudioStation/album.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of albums

    POST
    action=list
    &composer=
    &artist=
    &genre=
    &keyword=
    &sort_by=
    &sort_description=
    &offset=
    &limit=

    RESPONSE {
      data: {
        albums: [{
          album: 'album name',
          artist: 'artist name',
          display_artist: 'artist name',
          composer: 'composer name',
          genre: 'genre value',
          path: 'song file path',
          album_artist: 'artist name',
          comment: 'comment value',
          title: 'album title',
          name: 'album title'
          year: 'year number',
          additional: {
            rating: 'calculated from songs (TODO)'
          },
          created: 'date'
        }]
        offset
      },
      success: true
    }

[Top of page](#index)    

## /webapi/AudioStation/artist.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of albums

    POST
    action=list
    &genre=
    &keyword=
    &sort_by=
    &sort_description=
    &offset=
    &limit=

    RESPONSE {
      data: {
        artists: [{
          name: 'artist name',
          title: 'artist name',
          additional: {
            avg_rating: 'calculated from songs (TODO)'
          }
        }]
        offset
      },
      success: true
    }

[Top of page](#index)

## /webapi/AudioStation/composer.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of composers

    POST
    action=list
    &genre=
    &keyword=
    &sort_by=
    &sort_description=
    &offset=
    &limit=

    RESPONSE {
      data: {
        composers: [{
          name: 'composer name',
          title: 'composer name',
          additional: {
            avg_rating: 'calculated from songs (TODO)'
          }
        }]
        offset
      },
      success: true
    }

[Top of page](#index)

## /webapi/AudioStation/genre.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of genres

    POST 
    action=list
    &genre=
    &keyword=
    &sort_by=
    &sort_description=
    &offset=
    &limit

    RESPONSE {
      data: {
        genres: [{
          name: 'genre name',
          title: 'genre zname',
          additional: {
            avg_rating: 'calculated from songs (TODO)'
          }
        }],
        offset
      },
      success: true
    }

[Top of page](#index)

## /webapi/AudioStation/pinlist.cgi

This URL is used to create pinned items, rename, reorder, and unpin them.

### Create a pinned item

    POST 
    method=pin
    &items=<string of json> [{
      genre: 'name',
      composer: 'name',
      artist: 'name',
      folder: 'name'
    }]

    RESPONSE {
      data: {
        items: [{
          id: "1",
          name: "pinned item name"
        }],
        offset
      },
      success: true
    }

[Top of page](#index)

### Reorder pinned items

    POST 
    method=reorder
    &items=<string of json> [{
        id: "2",
        name: "Second pin"
      },{
        id: "3",
        name: "Third pin"
      },{
        id: "1",
        name: "First pin"
      }]

    RESPONSE {
      data: {
        items: [{
          id: "2",
          name: "Second pin"
        },{
          id: "3",
          name: "Third pin"
        },{
          id: "1",
          name: "First pin"
        }]
      },
      success: true
    }

[Top of page](#index)

### Rename a pinned item

    POST 
    method=rename
    &name=
    &items=<string of json> [{
        id: "2",
        name: "Second pin"
      }]

    RESPONSE {
      data: {
        items: [{
          id: "2",
          name: "new name value"
        },{
          id: "3",
          name: "Third pin"
        },{
          id: "1",
          name: "First pin"
        }]
      },
      success: true
    }

[Top of page](#index)

### Unpin an item

    POST 
    method=unpin
    &items=<string of json> [{
        id: "2",
        name: "Second pin"
      }]

    RESPONSE {
      data: {
        items: [{
          id: "3",
          name: "Third pin"
        },{
          id: "1",
          name: "First pin"
        }]
      },
      success: true
    }

[Top of page](#index)

### List pinned items

    POST 
    method=list

    RESPONSE {
      data: {
        items: [{
          id: "3",
          name: "Third pin"
        },{
          id: "1",
          name: "First pin"
        }]
      },
      success: true
    }

## /webapi/AudioStation/playlist.cgi

This URL is used to create, update, delete and list "simple" and smart playlists.

### Creating "simple" playlists

The "simple" playlists contain songs that you add to them.

    POST 
    method=create
    &name=

    RESPONSE {
      data: {
        playlists: [{
          id: 'playlist_personal_normal/My new playlist'
        }]
      },
      total: 1,
      success: true
    }

### Creating "smart" playlists

The "smart" playlists apply your rules to generate a list of songs.

    POST 
    method=createsmart
    &name=
    &conj_rule=and|or
    &rules_json = <string of json> [{
        tag: 1,
        op: 4,
        tagval: 'part of name',
        interval: 0
      }]

    RESPONSE {
      data: {
        playlists: [{
          id: 'playlist_personal_smart/My Smart Playlist'
        }]
      },
      success: true
    }

### Renaming "simple" playlists

    POST
    method=rename
    &id=
    &new_name=

    RESPONSE {
      data: {
        playlists: [{
          id: 'playlist_personal_normal/My renamed playlist'
        }]
      },
      total: 1,
      success: true
    }

### Adding songs to "simple" playlists

Playlists can receive a single song, a group of songs, album, artist, composer or genre.

    POST
    method=add_track
    &id=
    &album=
    &artist=
    &composer=
    &genre=

    RESPONSE {
      data: { 
        id: 'playlist_personal_smart/playlist name'
      }, 
      success: true
    }

### Updating "smart" playlists

    POST 
    method=updatesmart
    &id=
    &new_name=
    &conj_rule=and|or
    &rules_json = <string of json> [{
        tag: 1,
        op: 4,
        tagval: 'part of name',
        interval: 0
      }]

    RESPONSE {
      data: {
        playlists: [{
          id: 'playlist_personal_smart/My renamed playlist'
        }]
      },
      success: true
    }

### Deleting playlists

    POST 
    method=delete
    &id=

    RESPONSE {
      success: true
    }

### Listing playlists

This result is paginated, but not filtered or sorted.

    POST 
    method=list

    RESPONSE {
      data: {
        playlists: [{
          id: 'playlist_personal_normal/__SYNO_AUDIO_SHARED_SONGS__',
          name: '__SYNO_AUDIO_SHARED_SONGS__',
          library: 'personal',
          type: 'normal',
          sharing_status: 'none',
          additional: {
            sharing_info: {
              date_available: '0',
              date_expired: '0',
              id: '',
              status: 'none',
              url: ''
            },
            songs: [{}],
            songs_offset: 0,
            songs_total: 0
          }
        }, {
          id: 'playlist_personal_normal/My Playlist',
          name: 'My Playlist',
          library: 'personal',
          type: 'normal',
          sharing_status: 'none',
          additional: {
            sharing_info: {
              date_available: '0',
              date_expired: '0',
              id: '',
              status: 'none',
              url: ''
            },
            songs: [{}],
            songs_offset: 0,
            songs_total: 0
          }
        }, {
          id: 'playlist_personal_smart/My Smart Playlist',
          name: 'My Smart Playlist',
          library: 'personal',
          type: 'smart',
          sharing_status: 'none',
          additional: {
            sharing_info: {
              date_available: '0',
              date_expired: '0',
              id: '',
              status: 'none',
              url: ''
            },
            rules: [{
              tag: 1,
              op: 4,
              tagval: 'part of name',
              interval: 0
            }],
            rules_conjunction: 'or|and'
          }
        }]
      },
      total: 3,
      success: true
    }

### Get a playlist's information

    POST 
    method=getinfo
    &id=

    RESPONSE {
      data: {
        playlists: [{
          id: 'playlist_personal_smart/My Smart Playlist',
          name: 'My Smart Playlist',
          library: 'personal',
          type: 'smart',
          sharing_status: 'none',
          additional: {
            sharing_info: {
              date_available: '0',
              date_expired: '0',
              id: '',
              status: 'none',
              url: ''
            },
            rules: [{
              tag: 1,
              op: 4,
              tagval: 'part of name',
              interval: 0
            }],
            rules_conjunction: 'or|and'
          }
        }]
      },
      total: 1,
      success: true
    }

### Listing songs in playlists

This result is paginated, but not filtered or sortable.

    POST 
    method=list
    &id=
    &offset=
    &limit=

    RESPONSE {
      data: {
        playlists: [{
          id: 'playlist_personal_smart/My Smart Playlist',
          name: 'My Smart Playlist',
          library: 'personal',
          type: 'smart',
          sharing_status: 'none',
          additional: {
            sharing_info: {
              date_available: '0',
              date_expired: '0',
              id: '',
              status: 'none',
              url: ''
            },
            rules: [{
              tag: 1,
              op: 4,
              tagval: 'part of name',
              interval: 0
            }],
            rules_conjunction: 'or|and'
          },
          songs: [{
            additional: {
              song_audio: {
                duration: 180,
                bitrate: 160000,
                codec: "MPEG 1 Layer 3",
                container: "MPEG",
                frequency: 44100,
                channel: 2,
                lossless: true,
                filesize: 123456789
              },
              song_tag: {
                title: 'song title',
                comment: 'comment value',
                album: 'album name'
                album_artist: 'album artist name'
                artist: 'artist name'
                disc: 1,
                track: 3,
                year: 2020
              },
              song_rating: {
                rating: 3 
              }
            },
            title: 'song title',
            artist: 'artist name',
            album: 'album name'
          }, {
            additional: {
              song_audio: {
                duration: 180,
                bitrate: 160000,
                codec: "MPEG 1 Layer 3",
                container: "MPEG",
                frequency: 44100,
                channel: 2,
                lossless: true,
                filesize: 123456789
              },
              song_tag: {
                title: 'song title',
                comment: 'comment value',
                album: 'album name'
                album_artist: 'album artist name'
                artist: 'artist name'
                disc: 1,
                track: 3,
                year: 2020
              },
              song_rating: {
                rating: 3 
              }
            },
            title: 'song title',
            artist: 'artist name',
            album: 'album name'
          }],
          songs_offset: 0,
          songs_total: 2
        }]
      },
      total: 1,
      success: true
    }

[Top of page](#index)

## /webapi/AudioStation/search.cgi

This URL receives a keyword and searches your library for albums, artists and songs containing that word.

### Searching songs, artists and albums

    POST 
    keyword=

    RESPONSE {
      data: {
        albums: [{
          album: 'album name',
          artist: 'artist name',
          display_artist: 'artist name',
          composer: 'composer name',
          genre: 'genre value',
          path: 'song file path',
          album_artist: 'artist name',
          comment: 'comment value',
          title: 'album title',
          name: 'album title'
          year: 'year number',
          additional: {
            rating: 'calculated from songs (TODO)'
          },
          created: 'date'
        }],
        albumTotal: 1,
        artists: [{
          name: 'artist name',
          title: 'artist name',
          additional: {
            avg_rating: 'calculated from songs (TODO)'
          }
        }],
        artistTotal: 1,
        songs: [{
          additional: {
            song_audio: {
              duration: 180,
              bitrate: 160000,
              codec: "MPEG 1 Layer 3",
              container: "MPEG",
              frequency: 44100,
              channel: 2,
              lossless: true,
              filesize: 123456789
            },
            song_tag: {
              title: 'song title',
              comment: 'comment value',
              album: 'album name'
              album_artist: 'album artist name'
              artist: 'artist name'
              disc: 1,
              track: 3,
              year: 2020
            },
            song_rating: {
              rating: 3 
            }
          },
          title: 'song title',
          artist: 'artist name',
          album: 'album name'
        }]
        songTotal: 1
      },
      success: true
    }

[Top of page](#index)

## /webapi/AudioStation/proxy.cgi

This URL is used to stream and view track information of SHOUTcast radio stations.

### Currently-streaming track information

    URL 
    method=getsonginfo
    &stream_id=

    RESPONSE { 
      data: { 
        title: "current song name" 
      },
      success: true 
    }

### Stream a radio station

    method=getstreamid
    &id=

    RESPONSE {
        data: {
          format: 'mp3',
          stream_id: streamid
        },
        success: true
      }

### Stop a stream

    POST 
    method=deletesonginfo
    &stream_id=

    RESPONSE { 
      success: true 
    }

[Top of page](#index)

## /webapi/AudioStation/radio.cgi

This URL is used to add and update personal and favorite radio stations, list radio stations, list SHOUTcast genres, and list stations within genres.

### Add a personal or favorite radio station

    POST 
    method=add
    &container=Favorite|UserDefined
    &url=
    &title=
    &desc=

    RESPONSE {
      success: true
    }

### Update a personal or favorite radio station

The offset is the position of the item in the station list.

    POST 
    method=updateradio
    &container=Favorite|UserDefined
    &offset=1
    &items=<string of json> [{
      url: 'new value',
      title: 'new value',
      desc: 'new value
    }]

    RESPONSE {
      success: true
    }
  
### List personal and favorite radio stations

    POST 
    method=list
    container=Favorite|UserDefined
  
    RESPONSE {
      data: {
        radios: [{
          id: 'server determines based on station info',
          title: 'name',
          type: 'station',
          url: 'http://...'
        }]
      }
      success: true
    }
 
### List SHOUTcast genres

    POST 
    method=list
    container=SHOUTcast
  
    RESPONSE {
      data: {
        radios: [{
          id: 'server determines based on station info',
          title: 'name',
          type: 'station',
          url: 'http://...'
        }]
      }
      success: true
    }
 
### List SHOUTcast stations within genre

Note the "Name" in the container value is any SHOUTcast genre name.

    POST 
    method=list
    container=SHOUTcast_genre_Name
  
    RESPONSE {
      data: {
        radios: [{
          id: 'server determines based on station info',
          title: 'name',
          type: 'station',
          url: 'http://...'
        }]
      }
      success: true
    }

[Top of page](#index)


## /webapi/AudioStation/song.cgi

This URL is used to update song ratings and list songs.  This URL is paginated, sortable, and filters results with optional field(s).

### Setting a song rating

    POST 
    method=setrating
    &rating=3

    RESPONSE {
      data: {
        songs: [{
          additional: {
            song_audio: {
              duration: 180,
              bitrate: 160000,
              codec: "MPEG 1 Layer 3",
              container: "MPEG",
              frequency: 44100,
              channel: 2,
              lossless: true,
              filesize: 123456789
            },
            song_tag: {
              title: 'song title',
              comment: 'comment value',
              album: 'album name'
              album_artist: 'album artist name'
              artist: 'artist name'
              disc: 1,
              track: 3,
              year: 2020
            },
            song_rating: {
              rating: 3 
            }
          },
          title: 'song title',
          artist: 'artist name',
          album: 'album name'
      }],
      total: 1,
      success: true
    }

[Top of page](#index)

### Retrieve a list of songs

    POST
    method=list
    &album=
    &composer=
    &genre=
    &artist=
    &sort_by=
    &sort_description=
    &offset=
    &limit=

    RESPONSE {
      data: {
        songs: [{
          additional: {
            song_audio: {
              duration: 180,
              bitrate: 160000,
              codec: "MPEG 1 Layer 3",
              container: "MPEG",
              frequency: 44100,
              channel: 2,
              lossless: true,
              filesize: 123456789
            },
            song_tag: {
              title: 'song title',
              comment: 'comment value',
              album: 'album name'
              album_artist: 'album artist name'
              artist: 'artist name'
              disc: 1,
              track: 3,
              year: 2020
            },
            song_rating: {
              rating: 3 
            }
          },
          title: 'song title',
          artist: 'artist name',
          album: 'album name'
      }]
        offset
      },
      success: true
    }

[Top of page](#index)

## /webapi/AudioStation/stream.cgi

This URL, accessed via `stream.cgi/0.mp3`, is used to stream or transcode-first an item from your library.

### Transcoding files

    URL
    method=transcode
    &id=

    RESPONSE <song data>

### Streaming files

    URL
    method=stream
    &id=

    RESPONSE <song data>

[Top of page](#index)
