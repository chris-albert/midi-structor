import { ReactControllersApp } from './ReactControllersApp'

const ControllerListener = () => {
  console.log('Controllers Init')
  ReactControllersApp()
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
