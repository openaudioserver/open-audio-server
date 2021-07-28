module.exports = (_, res, postData) => {
  if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '1') {
    return res.end(AudioStationInfoCGI1)
  } else if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '2') {
    return res.end(AudioStationInfoCGI2)
  } else if (postData.api === 'SYNO.AudioStation.Info' && postData.method === 'getinfo' && postData.version === '4') {
    return res.end(AudioStationInfoCGI3)
  }
}

const AudioStationInfoCGI1 = JSON.stringify({
  data: {
    path: '/webman/3rdparty/AudioStation',
    version: {
      build: '3377',
      major: '6',
      minor: '5'
    }
  },
  success: true
})
const AudioStationInfoCGI2 = JSON.stringify({
  data: {
    browse_personal_library: 'all',
    dsd_decode_capability: true,
    enable_equalizer: false,
    enable_personal_library: false,
    enable_user_home: false,
    has_music_share: true,
    is_manager: false,
    privilege: {
      playlist_edit: false,
      remote_player: false,
      sharing: false,
      tag_edit: false,
      upnp_browse: false
    },
    remote_controller: false,
    same_subnet: true,
    serial_number: '1130LWN011720',
    settings: {
      audio_show_virtual_library: true,
      disable_upnp: false,
      enable_download: false,
      prefer_using_html5: true,
      transcode_to_mp3: true
    },
    sid: 'ap0hulniOX5f.1130LWN011720',
    support_bluetooth: true,
    support_usb: true,
    support_virtual_library: true,
    transcode_capability: [
      'wav',
      'mp3'
    ],
    version: 3377,
    version_string: '6.5.6-3377'
  },
  success: true
})

const AudioStationInfoCGI3 = JSON.stringify({
  data: {
    browse_personal_library: 'all',
    dsd_decode_capability: true,
    enable_equalizer: false,
    enable_personal_library: false,
    enable_user_home: false,
    has_music_share: true,
    is_manager: true,
    playing_queue_max: 8192,
    privilege: {
      playlist_edit: true,
      remote_player: true,
      sharing: true,
      tag_edit: true,
      upnp_browse: true
    },
    remote_controller: false,
    same_subnet: true,
    serial_number: '1130LWN011720',
    settings: {
      audio_show_virtual_library: true,
      disable_upnp: false,
      enable_download: false,
      prefer_using_html5: true,
      transcode_to_mp3: true
    },
    sid: 'ap0hulniOX5f.1130LWN011720',
    support_bluetooth: true,
    support_usb: true,
    support_virtual_library: true,
    transcode_capability: [
      'wav',
      'mp3'
    ],
    version: 3377,
    version_string: '6.5.6-3377'
  },
  success: true
})
