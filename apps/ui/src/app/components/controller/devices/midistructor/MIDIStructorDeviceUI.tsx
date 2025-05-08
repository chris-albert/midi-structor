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
import { PrimitiveAtom } from 'jotai'

type MIDIStructorDeviceUIComponentProps = {
  configuredController: PrimitiveAtom<ConfiguredController>
}

const MIDIStructorDeviceUIComponent: React.FC<
  MIDIStructorDeviceUIComponentProps
> = ({ configuredController }) => {
  const controller = ConfiguredController.useController(configuredController)
  const listener = ConfiguredController.useVirtualListener(
    controller.controller
  )
  const store = MIDIStructorUI.useStore(controller.name).useGet()
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
        updateWidgets={(widgets) => {
          console.log('updateWidgets', widgets)
          return widgets
        }}
      />
    </Box>
  )
}

export const MIDIStructorDeviceUI = ControllerUIDevice.of({
  controller: MIDIStructorUI.device,
  Component: (configuredController) => {
    return (
      <MIDIStructorDeviceUIComponent
        configuredController={configuredController}
      />
    )
  },
  useStore: MIDIStructorUI.useStore,
})

export type MIDIStructorDeviceUI = typeof MIDIStructorDeviceUI
