import { ReactControllersApp } from './ReactControllersApp'
import ControllerWorkerMainOld from '../workers/controller/ControllerWorkerMainOld?worker'
import { log } from '../logger/log'
import { ControllerWorker } from '../workers/controller/ControllerWorker'

const USE_WORKER = true
const NEW_CONTROLLER = true

const usingWorker = () => {
  log.info('Loading Worker Controller...')
  if (NEW_CONTROLLER) {
    ControllerWorker.init()
  } else {
    new ControllerWorkerMainOld({ name: 'controller' })
  }
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
