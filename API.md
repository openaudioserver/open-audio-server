The Synology API for Audio Station is a combination of routes from Synology's DSM operating system and Audio Station.

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
| /webapi/AudioStation/pinlist.cgi | equivalent | POST | method, items |
| /webapi/AudioStation/playlist.cgi | equivalent | POST | method, name, new_name, songs, album, artist, composer, genre, id, rules_json |
| /webapi/AudioStation/proxy.cgi | equivalent | GET | method, id, stream_id, |
| /webapi/AudioStation/radio.cgi | equivalent | POST | method, container, url, title, desc, offset |
| /webapi/AudioStation/remote_player_status.cgi | equivalent | POST | |
| /webapi/AudioStation/remote_player.cgi | equivalent | POST | method, action, volume, value, songs, containers_json |
| [/webapi/AudioStation/search.cgi](#searchingsongsartistsalbums) | equivalent | POST | keyword |
| [/webapi/AudioStation/song.cgi](#retrievealistofsongs) | equivalent | POST | method, id, rating, album, composer, genre, artist, sort_by, sort_direction | 
| /webapi/AudioStation/stream.cgi | equivalent | GET | method, id | 
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

[Top of page](#)

## /webman/3rdparty/AudioStation/webUI/audio_search_lyrics.cgi

This URL is pending implementation in Open Audio Server. That means it returns a static, successful response message to all requests.

[Top of page](#)

## /webapi/AudioStation/album.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of albums

    POST
    composer=
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
      success
    }

[Top of page](#)    

## /webapi/AudioStation/artist.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of albums

    POST
    genre=
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
      success
    }

[Top of page](#)

## /webapi/AudioStation/composer.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of composers

    POST
    genre=
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
      success
    }

[Top of page](#)

## /webapi/AudioStation/genre.cgi

This URL is paginated, sortable, and filters results with optional field(s).

### Retrieves list of genres

    POST 
    genre=
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
      success
    }

[Top of page](#)

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
      success
    }

[Top of page](#)

### Retrieve a list of songs

    POST
    album=
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
      success
    }

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
      success
    }

[Top of page](#)
