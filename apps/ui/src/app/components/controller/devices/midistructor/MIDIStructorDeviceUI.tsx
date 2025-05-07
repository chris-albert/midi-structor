import React from 'react'
import {
  MIDIStructorUI,
  ControllerUIDevice,
  ConfiguredController,
  MidiEmitter,
  MidiMessage,
} from '@midi-structor/core'
import { MidiStructorComponent } from './MidiStructorComponent'
import { Box } from '@mui/material'
import { MidiStructorEditWidgets } from './MidiStructorEditWidgets'

type MIDIStructorDeviceUIComponentProps = {
  configuredController: ConfiguredController
}

const MIDIStructorDeviceUIComponent: React.FC<
  MIDIStructorDeviceUIComponentProps
> = ({ configuredController }) => {
  const listener = ConfiguredController.useVirtualListener(configuredController)
  const store = MIDIStructorUI.useStore(configuredController.name).useGet()
  const midiEmitter: MidiEmitter = {
    send: (m: MidiMessage) => {
      listener.emit(MidiMessage.raw(m))
    },
  }
  const [editWidgets, setEditWidgets] = React.useState(false)

  return (
    <Box>
      <MidiStructorEditWidgets
        editWidgets={editWidgets}
        toggleEditWidgets={() => setEditWidgets((e) => !e)}
      />
      <MidiStructorComponent
        editWidgets={editWidgets}
        store={store}
        midiEmitter={midiEmitter}
      />
    </Box>
  )
}

export const MIDIStructorDeviceUI = ControllerUIDevice.of({
  controller: MIDIStructorUI.device,
  component: (configuredController) => {
    return (
      <MIDIStructorDeviceUIComponent
        configuredController={configuredController}
      />
    )
  },
  useStore: MIDIStructorUI.useStore,
})

export type MIDIStructorDeviceUI = typeof MIDIStructorDeviceUI
