import { log } from '../../logger/log'
import _ from 'lodash'
import { ControllerApp } from './ControllerApp'
import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import { ConfiguredControllerIO } from '../../controllers/ConfiguredControllerHooks'

const LISTENER = EventEmitter<MidiEventRecord>()
const EMITTER = EventEmitter<MidiEventRecord>()

const createIO = (): ConfiguredControllerIO => ({
  listener: LISTENER,
  emitter: {
    send: (message) => {
      // log.info('on message', message)
      EMITTER.emit(message)
    },
  },
})

onmessage = (message) => {
  if (_.isArray(message.data) && message.data.length == 2) {
    const [messageType, messageData] = message.data
    if (messageType === 'INIT') {
      log.info('Loading controller', messageData)
      ControllerApp(messageData, createIO())
    } else if (messageType === 'EMITTER') {
      LISTENER.emit(messageData)
    }
  }
}

EMITTER.on('*', (m) => postMessage(['LISTENER', m]))
