import React from 'react'
import { MIDIStructorUI, ControllerUIDevice } from '@midi-structor/core'
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
