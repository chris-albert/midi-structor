import { MidiDeviceManager } from './MidiDeviceManager'
import { DawMidi } from './DawMidi'
import { ProjectWorker } from '../workers/project/ProjectWorker'

const runInit = () => {
  DawMidi.init()
}

let isInit = false
const init = (manager: MidiDeviceManager) => {
  MidiDeviceManager.state.set(manager)
  if (!isInit) {
    const projectWorker = ProjectWorker.instance()

    // Set up DAW Listener
    DawMidi.states.daw.listener.sub((listener) =>
      listener.on('*', projectWorker.emitter.send)
    )
    // Set up DAW Emitter
    DawMidi.states.daw.emitter.sub((emitter) => {
      projectWorker.listener.on('*', emitter.send)
    })
    isInit = true
  }
  runInit()
}

export const Midi = {
  init,
}
