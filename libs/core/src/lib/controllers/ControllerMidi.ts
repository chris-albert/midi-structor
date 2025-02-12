import { ReactControllerApp } from './ReactControllerApp'

const ControllerListener = () => {
  console.log('Controller Init')
  ReactControllerApp()
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
