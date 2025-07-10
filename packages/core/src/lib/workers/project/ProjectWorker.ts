import ProjectWorkerMain from './ProjectWorkerMain?worker'
import { MidiMessage } from '../../midi/MidiMessage'
import _ from 'lodash'
import { MidiListener } from '../../midi/MidiListener'
import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import { MidiEmitter } from '../../midi/MidiEmitter'

export type ProjectWorker = {
  listener: MidiListener
  emitter: MidiEmitter
}

const create = (): ProjectWorker => {
  const worker = new ProjectWorkerMain({ name: 'project' })

  const listener = EventEmitter<MidiEventRecord>()
  const emitter: MidiEmitter = {
    send: (message: MidiMessage) => {
      worker.postMessage(['DAW_LISTENER', message])
    },
  }

  worker.onmessage = (event) => {
    if (_.isArray(event.data) && event.data.length == 2) {
      if (event.data[0] === 'DAW_EMITTER') {
        listener.emit(event.data[1])
      }
    }
  }

  return {
    listener,
    emitter,
  }
}

let INSTANCE: ProjectWorker | undefined = undefined
const instance = (): ProjectWorker => {
  if (INSTANCE === undefined) {
    INSTANCE = create()
  }
  return INSTANCE
}

export const ProjectWorker = {
  instance,
}
