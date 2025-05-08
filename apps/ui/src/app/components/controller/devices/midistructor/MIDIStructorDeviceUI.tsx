import React from 'react'
import {
  MIDIStructorUI,
  ControllerUIDevice,
  ConfiguredController,
  MidiEmitter,
  MidiMessage,
  MIDIStructorUIWidgetsUpdate,
  SchemaHelper,
  AllMidiStructorWidgets,
  ControllerConfig,
} from '@midi-structor/core'
import { MidiStructorComponent } from './MidiStructorComponent'
import { Box } from '@mui/material'
import { MidiStructorEditWidgets } from './MidiStructorEditWidgets'
import { PrimitiveAtom } from 'jotai'
import { Either, Schema } from 'effect'
import { toast } from 'react-toastify'

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

  const updateWidgets: MIDIStructorUIWidgetsUpdate = (widgets) => {
    // @ts-ignore
    const updated = widgets(controller.config.widgets)
    const stringWidgets = SchemaHelper.encode(
      Schema.Struct({
        widgets: Schema.Array(AllMidiStructorWidgets.schema),
      }),
      { widgets: updated }
    )
    Either.match(ControllerConfig.parse(stringWidgets, MIDIStructorUI.device), {
      onRight: (widgets) => {
        controller.setConfig(widgets)
      },
      onLeft: (error) => toast.error(error),
    })
  }

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
        updateWidgets={updateWidgets}
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
