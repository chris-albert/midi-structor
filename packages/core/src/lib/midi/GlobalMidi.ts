import { MidiDeviceManager } from './MidiDeviceManager'
import ProjectWorkerMain from '../workers/project/ProjectWorkerMain?worker'
import _ from 'lodash'
import { DawMidi } from './DawMidi'

const useMidiAllowed = () => {
  return MidiDeviceManager.state.useValue().isAllowed
}

const runInit = () => {
  DawMidi.init()
}

let isInit = false
const init = (manager: MidiDeviceManager) => {
  MidiDeviceManager.state.set(manager)
  if (!isInit) {
    const PROJECT_WORKER_MAIN = new ProjectWorkerMain({ name: 'project' })
    // Set up DAW Listener
    DawMidi.states.daw.listener.sub((listener) =>
      listener.on('*', (m) =>
        PROJECT_WORKER_MAIN.postMessage(['DAW_LISTENER', m])
      )
    )
    // Set up DAW Emitter
    DawMidi.states.daw.emitter.sub((emitter) => {
      PROJECT_WORKER_MAIN.onmessage = (event) => {
        if (_.isArray(event.data) && event.data.length == 2) {
          if (event.data[0] === 'DAW_EMITTER') {
            emitter.send(event.data[1])
          }
        }
      }
    })
    isInit = true
  }
  runInit()
}

export const Midi = {
  init,
  useMidiAllowed,
}
