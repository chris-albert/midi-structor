import { Midi, MidiDeviceManager, ControllerMidi } from '@midi-structor/core'
import React from 'react'
import { AllControllerUIDevices } from '../components/controller/devices/AllControllerUIDevices'

const useAccess = () => {
  React.useEffect(() => {
    MidiDeviceManager.build(true)
      .then((manager) => {
        Midi.init(manager)
        AllControllerUIDevices.init()
        ControllerMidi.init()
      })
      .catch(console.error)
  }, [])
}

export const MidiAccess = {
  useAccess,
}
