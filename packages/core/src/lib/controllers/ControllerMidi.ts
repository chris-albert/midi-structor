import { ReactControllersApp } from './ReactControllersApp'
import ControllerWorkerMain from '../workers/controller/ControllerWorkerMain?worker'
import { log } from '../logger/log'

const USE_WORKER = true

const usingWorker = () => {
  log.info('Loading Worker Controller...')
  new ControllerWorkerMain({ name: 'controller' })
}

const usingLocal = () => {
  log.info('Loading Local Controller...')
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
