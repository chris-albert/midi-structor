inlets = 1
outlets = 1

var API = null

var SYSEX_START = 0xf0
var SYSEX_END = 0xf7

var MANUFACURER_ID = 0x02

function init() {
  API = new LiveAPI(function () {}, 'live_set')
}

function getApi() {
  return API
}

var RX_MESSAGE = {
  0x40: function () {
    post('init\n')
    outlet(0, 'initAck')
  },
  0x41: function () {
    post('initReady\n')
    outlet(0, 'initProject')
  },
  0x50: function () {
    post('starting\n')
    var api = getApi()
    api.call('start_playing')
  },
  0x51: function () {
    post('stopping\n')
    var api = getApi()
    api.call('stop_playing')
  },
  0x52: function (cueIndex) {
    var cue = new LiveAPI(function () {}, 'live_set cue_points ' + cueIndex)
    cue.call('jump')
  },
  0x54: function (jumpBeat) {
    var api = getApi()
    api.call('jump_by', jumpBeat)
  },
  0x55: function (on) {
    post('recording\n')
    var api = getApi()
    api.set('record_mode', on)
  },
  0x56: function (on) {
    post('metronome', on, '\n')
    var api = getApi()
    api.set('metronome', on)
  },
  0x57: function (on) {
    post('loop', on, '\n')
    var api = getApi()
    api.set('loop', on)
  },
}

function msg_int(i) {
  processByte(i)
}

var buffer = []

function processByte(byte) {
  if (byte == SYSEX_START) {
    buffer = []
  } else if (byte == SYSEX_END) {
    processMessage()
    buffer = []
  } else {
    post('byte: ' + byte)
    buffer.push(byte)
  }
}

function charCodesToNumber(charCodes) {
  var str = ''
  for (var i = 0; i < charCodes.length; i++) {
    str += String.fromCharCode(charCodes[i])
  }
  try {
    return parseInt(str)
  } catch (e) {
    return -1
  }
}

function processMessage() {
  if (buffer[0] == MANUFACURER_ID) {
    post(buffer[1], '\n')
    var func = RX_MESSAGE[buffer[1]]
    if (func != undefined) {
      func(charCodesToNumber(buffer.slice(2)))
    }
  }
}
