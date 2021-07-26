The Synology API for Audio Station is a combination of routes from Synology's DSM operating system and Audio Station.

| State      | Value                                                        |
|------------|--------------------------------------------------------------|
| mimic      | Open Audio Server serves a response copied from Synology     |
| equivalent | Open Audio Server generates the same response Synology would |
| pending    | Open Audio Server did nothing but replied with success       |

| Route                                                              | State      | Method   | Parameters                                                                        |
|--------------------------------------------------------------------|------------|----------|-----------------------------------------------------------------------------------|
| /src/webman/login.cgi                                              | mimic      | POST     |                                                                                   |
| /src/webman/security.cgi                                           | mimic      | POST     |                                                                                   |
| /src/webman/3rdparty/AudioStation/tagEditorUI/tag_editor.cgi       | equivalent | POST     | action                                                                            |
| /src/webman/3rdparty/AudioStation/webUI/audio_search_lyrics.cgi    | pending    | POST     |                                                                                   |
| /src/webapi/auth.cgi                                               | mimic      | POST     |                                                                                   |
| /src/webapi/encrpytion.cgi                                         | mimic      | POST     |                                                                                   |
| /src/webapi/entry.cgi                                              | mimic      | GET+POST |                                                                                   |
| /src/webapi/query.cgi                                              | equivalent | POST     |                                                                                   |
| /src/webapi/AudioStation/album.cgi                                 | equivalent | POST     | composer, artist, genre, keyword, sort_by, sort_direction, offset, limit          |
| /src/webapi/AudioStation/artist.cgi                                | equivalent | POST     | genre, keyword, sort_by, sort_direction, offset, limit                            |
| /src/webapi/AudioStation/composer.cgi                              | equivalent | POST     | keyword, sort_by, sort_direction, offset, limit                                   |
| /src/webapi/AudioStation/cover.cgi                                 | equivalent | GET      | id, album_name, artist_name, composer_name, output_default, default_genre_name    | 
| /src/webapi/AudioStation/genre.cgi                                 | equivalent | POST     | method, keyword, sort_sort_by, offset, limit                                      |
| /src/webapi/AudioStation/info.cgi                                  | mimic      | POST     |                                                                                   | 
| /src/webapi/AudioStation/lyrics_search.cgi                         | pending    | POST     |                                                                                   |
| /src/webapi/AudioStation/lyrics.cgi                                | pending    | POST     |                                                                                   |
| /src/webapi/AudioStation/pinlist.cgi                               | equivalent | POST     | method, items                                                                     |
| /src/webapi/AudioStation/playlist.cgi                              | equivalent | POST     | method, name, new_name, songs, album, artist, composer, genre, id, rules_json,    |
| /src/webapi/AudioStation/proxy.cgi                                 | equivalent | GET      | method, id, stream_id,                                                            |
| /src/webapi/AudioStation/radio.cgi                                 | equivalent | POST     | method, container, url, title, desc, offset                                       |
| /src/webapi/AudioStation/remote_player_status.cgi                  | equivalent | POST     |                                                                                   |
| /src/webapi/AudioStation/remote_player.cgi                         | equivalent | POST     | method, action, volume, value, songs, containers_json                             |
| /src/webapi/AudioStation/search.cgi                                | equivalent | POST     | keyword                                                                           |
| /src/webapi/AudioStation/song.cgi                                  | equivalent | POST     | method, id, rating, album, composer, genre, artist, sort_by, sort_direction       | 
| /src/webapi/AudioStation/stream.cgi                                | equivalent | GET      | method, id                                                                        | 
| /src/webapi/AudioStation/web_player.cgi                            | equivalent | POST     | method, songs, updated_index, containers_json, offset                             |
    
