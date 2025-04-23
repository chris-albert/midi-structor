import { ControllerUIDevice, ControllerUIDevices } from '@midi-structor/core'
import { LaunchPadMiniMk3UI } from './LaunchPadMiniMk3UI'
import { MIDIStructorDeviceUI } from './midistructor/MIDIStructorDeviceUI'

const allDevices: Array<ControllerUIDevice<any>> = [LaunchPadMiniMk3UI, MIDIStructorDeviceUI]

const init = () => {
  ControllerUIDevices.init(allDevices)
}

export const AllControllerUIDevices = { init }
