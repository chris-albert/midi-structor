import { ReactReconcilerController } from './ReactReconcilerController'

const ControllerListener = () => {
  console.log('Controller Init')
  ReactReconcilerController()
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
