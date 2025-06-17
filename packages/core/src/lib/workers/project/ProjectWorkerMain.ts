import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import _ from 'lodash'
import { ProjectMain } from './ProjectMain'

console.log('Loading Project Worker Main')

const DAW_LISTENER = EventEmitter<MidiEventRecord>()

onmessage = (message) => {
  console.log('Project Worker Message', message)
  if (_.isArray(message.data) && message.data.length == 2) {
    if (message.data[0] === 'DAW_LISTENER') {
      DAW_LISTENER.emit(message.data[1])
    }
  }
}

ProjectMain.init()
