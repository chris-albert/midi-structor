import React from 'react'
import { ControllerUIDevice } from '../ControllerUIDevice'
import { MIDIStructorUI } from '@midi-structor/core'
import { MidiStructorComponent } from './MidiStructorComponent'

export const MIDIStructorDeviceUI = ControllerUIDevice.of({
  controller: MIDIStructorUI,
  component: (configuredController) => {
    return <MidiStructorComponent configuredController={configuredController} />
  },
})
