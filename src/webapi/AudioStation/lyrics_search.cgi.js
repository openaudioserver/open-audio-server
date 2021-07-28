module.exports = (_, res) => {
  return res.end(LyricsWiki)
}

const LyricsWiki = JSON.stringify({
  data: {
    lyrics: [
      {
        additional: {
          full_lyrics: '\n\n\nNote: LyricWiki is a license restricted plugin. Only a small portion of the lyrics are shown.\n'
        },
        artist: null,
        id: 'lyricwiki@\n\n\nNote: LyricWiki is a license restricted plugin. Only a small portion of the lyrics are shown.\n',
        partial_lyrics: '\n\n\nNote: LyricWiki is a license restricted plugin. Only a small portion of the lyrics are shown.\n',
        plugin: 'LyricWiki',
        title: null
      }
    ]
  },
  success: true
})
