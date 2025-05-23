import { ReactControllersApp } from './ReactControllersApp'
import ControllerWorker from '../workers/controller/worker?worker'

const USE_WORKER = true

const usingWorker = () => {
  console.log('Loading Worker Controller...')
  new ControllerWorker()
}

const usingLocal = () => {
  console.log('Loading Local Controller...')
  ReactControllersApp()
}

const ControllerListener = () => {
  const _ = USE_WORKER ? usingWorker() : usingLocal()
}

let isInit = false
const init = () => {
  if (!isInit) {
    isInit = true
    ControllerListener()
  }
}

export const ControllerMidi = {
  init,
}
