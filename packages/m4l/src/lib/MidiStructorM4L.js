var DATA_DELIMITER = 0x01
var MANUFACTURER_ID = 0x02
var EMIT_MILLIS = 10

var STATUS = {
  INIT_ACK: 0x02,
  INIT: 0x03,
  DONE: 0x04,
  TRACK: 0x05,
  CLIP: 0x06,
  BEAT: 0x07,
  BAR_BEAT: 0x08,
  SIG: 0x09,
  TEMPO: 0x0a,
  IS_PLAYING: 0x0b,
  CUE: 0x0c,
  METRO_STATE: 0x0d,
  LOOP: 0x0e,
}

var SYSEX = {
  START: 0xf0,
  END: 0xf7,
}

function toBytes(input) {
  var raw = JSON.stringify(input).replace(/\"/g, '')
  var length = raw.length
  var outArr = []
  for (var i = 0; i < length; i++) {
    outArr.push(raw.charCodeAt(i))
  }
  return outArr
}

/**
 * Formats sysex message
 * @param data Array of data to send
 */
function sysex(datas) {
  var length = datas.length
  var outArr = [SYSEX.START, MANUFACTURER_ID]
  for (var i = 0; i < length; i++) {
    outArr = outArr.concat(toBytes(datas[i]))
    if (i < length - 1) {
      outArr.push(DATA_DELIMITER)
    }
  }
  outArr.push(SYSEX.END)
  return outArr
}

var Message = {
  initAck: function (projectName) {
    return sysex([STATUS.INIT_ACK, projectName])
  },
  init: function () {
    return sysex([STATUS.INIT])
  },
  done: function () {
    return sysex([STATUS.DONE])
  },
  track: function (name, trackIndex, color) {
    return sysex([STATUS.TRACK, name, trackIndex, color])
  },
  clip: function (name, trackIndex, clipIndex, color, startTime, endTime) {
    return sysex([
      STATUS.CLIP,
      name,
      trackIndex,
      clipIndex,
      color,
      startTime,
      endTime,
    ])
  },
  beat: function (value) {
    return sysex([STATUS.BEAT, value])
  },
  barBeat: function (value) {
    return sysex([STATUS.BAR_BEAT, value])
  },
  sig: function (count, length) {
    return sysex([STATUS.SIG, count, length])
  },
  tempo: function (bpm) {
    return sysex([STATUS.TEMPO, bpm])
  },
  isPlaying: function (playing) {
    return sysex([STATUS.IS_PLAYING, playing])
  },
  cue: function (cuePoint) {
    return sysex([
      STATUS.CUE,
      cuePoint.id,
      cuePoint.name,
      cuePoint.time,
      cuePoint.index,
    ])
  },
  metroState: function (state) {
    return sysex([STATUS.METRO_STATE, state])
  },
  loop: function (state) {
    return sysex([STATUS.LOOP, state])
  },
}

inlets = 1
outlets = 2

function set_emit_millis(millis) {
  EMIT_MILLIS = millis
}

function beat(num) {
  outlet(0, Message.beat(num))
}

function barBeat(num) {
  outlet(0, Message.barBeat(num))
}

function sig(count, duration) {
  outlet(0, Message.sig(count, duration))
}

function tempo(num) {
  outlet(0, Message.tempo(num))
}

function isPlaying(num) {
  outlet(0, Message.isPlaying(num))
}

var api = null
var tracks = null
var cues = null

function forEach(arr, func) {
  var length = arr.length
  for (var i = 0; i < length; i++) {
    func(arr[i], i)
  }
}

function metronomeState(state) {
  outlet(0, Message.metroState(state[1]))
}

function loopState(state) {
  outlet(0, Message.loop(state[1]))
}

var metroObserver = null
var loopObserver = null
function setupObservers() {
  metroObserver = new LiveAPI(metronomeState, 'live_set')
  metroObserver.property = 'metronome'
  loopObserver = new LiveAPI(loopState, 'live_set')
  loopObserver.property = 'loop'
}

function initAck() {
  var api = new LiveAPI(function () {}, 'live_set')
  projectName = api.get('name')
  post('initAck', projectName, '\n')
  outlet(0, Message.initAck(projectName))
}

function init() {
  post('nothing to do here right now\n')
}

function initProject() {
  setupObservers()

  post('Init Project\n')
  tracks = parseTracks()
  cues = parseCues()

  emit(tracks, cues)

  tracks = null
  cues = null
}

function emit(tracks, cues) {
  var messages = generateMessages(tracks, cues)
  var totalMessages = messages.length
  post('Starting to emit', totalMessages, 'messages\n')
  outlet(1, '0%')

  var task = new Task(function () {
    if (messages.length > 0) {
      var percentage =
        Math.floor((arguments.callee.task.iterations / totalMessages) * 100) +
        '%'
      outlet(1, percentage)
      outlet(0, messages.shift())
    } else {
      outlet(1, 'Done')
      post('Done emitting messages\n')
    }
  }, {})
  task.interval = EMIT_MILLIS
  task.repeat(messages.length + 1)
}

function generateMessages(tracks, cues) {
  var messages = []
  messages.push(Message.init())

  post('Processing', tracks.tracks.length, 'tracks \n')
  forEach(tracks.tracks, function (track) {
    messages.push(Message.track(track.name, track.trackIndex, track.color))
  })

  post('Processing', tracks.clips.length, 'clips \n')
  forEach(tracks.clips, function (clip) {
    messages.push(
      Message.clip(
        clip.name,
        clip.trackIndex,
        clip.clipIndex,
        clip.color,
        clip.startTime,
        clip.endTime
      )
    )
  })

  post('Processing', cues.length, 'cues \n')
  forEach(cues, function (cue) {
    messages.push(Message.cue(cue))
  })

  messages.push(Message.done())

  return messages
}

function parseTracks() {
  api = new LiveAPI(function () {}, 'live_set')
  var tracksCount = api.getcount('tracks')
  var tracks = []
  var clips = []
  for (var trackIndex = 0; trackIndex < tracksCount; trackIndex++) {
    var tmp = parseTrack(trackIndex)
    if (tmp !== undefined) {
      tracks.push(tmp.track)
      clips = clips.concat(tmp.clips)
    }
  }

  return {
    tracks: tracks,
    clips: clips,
  }
}

function parseTrack(trackIndex) {
  api.path = 'live_set tracks ' + trackIndex
  var name = api.get('name')[0]
  var color = api.get('color')[0]
  if (api.get('has_midi_output')[0] === 1) {
    var clipsCount = api.getcount('arrangement_clips')
    var clips = []
    for (var clipIndex = 0; clipIndex < clipsCount; clipIndex++) {
      clips.push(parseTrackClip(trackIndex, clipIndex))
    }
    return {
      track: {
        type: 'track',
        trackIndex: trackIndex,
        name: name,
        color: color,
      },
      clips: clips,
    }
  } else {
    return undefined
  }
}

function parseTrackClip(trackIndex, clipIndex) {
  api.path = 'live_set tracks ' + trackIndex + ' arrangement_clips ' + clipIndex
  return {
    type: 'clip',
    trackIndex: trackIndex,
    clipIndex: clipIndex,
    name: api.get('name')[0],
    color: api.get('color')[0],
    startTime: api.get('start_time')[0],
    endTime: api.get('end_time')[0],
  }
}

function parseCues() {
  api.path = 'live_set'
  var cueCount = api.getcount('cue_points')
  var cues = []
  for (var cueIndex = 0; cueIndex < cueCount; cueIndex++) {
    api.path = 'live_set cue_points ' + cueIndex
    cues.push({
      type: 'cue',
      id: api.id,
      name: api.get('name')[0],
      time: api.get('time')[0],
      index: cueIndex,
    })
  }
  return cues
}
