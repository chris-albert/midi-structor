import React from 'react'
import { ControllerUIDevice } from '../ControllerUIDevice'
import { MIDIStructorUI } from '@midi-structor/core'
import { MidiStructorComponent } from './MidiStructorComponent'

const device = MIDIStructorUI.device

export const MIDIStructorDeviceUI = ControllerUIDevice.of({
  controller: device,
  component: (configuredController) => {
    return (
      <MidiStructorComponent
        configuredController={configuredController}
        device={device}
      />
    )
  },
})
