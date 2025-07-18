import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import _ from 'lodash'
import { ProjectMain } from './ProjectMain'
import { log } from '../../logger/log'

log.info('Loading Project Worker Main')

const DAW_LISTENER = EventEmitter<MidiEventRecord>()
const DAW_EMITTER = EventEmitter<MidiEventRecord>()

onmessage = (message) => {
  if (_.isArray(message.data) && message.data.length == 2) {
    if (message.data[0] === 'DAW_LISTENER') {
      DAW_LISTENER.emit(message.data[1])
    }
  }
}

DAW_EMITTER.on('*', (m) => postMessage(['DAW_EMITTER', m]))

ProjectMain.init(DAW_LISTENER, DAW_EMITTER)
