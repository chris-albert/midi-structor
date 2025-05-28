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
  MIDIStructorUIWidgets,
} from '@midi-structor/core'
import { MidiStructorComponent } from './MidiStructorComponent'
import { Box, LinearProgress } from '@mui/material'
import { MidiStructorEditWidgets } from './MidiStructorEditWidgets'
import { Either, Schema } from 'effect'
import { toast } from 'react-toastify'

type MIDIStructorDeviceUIComponentProps = {
  configuredController: ConfiguredController
  setWidgets: (w: MIDIStructorUIWidgets) => void
}

const MIDIStructorDeviceUIComponent: React.FC<
  MIDIStructorDeviceUIComponentProps
> = ({ configuredController, setWidgets }) => {
  const listener = ConfiguredController.useVirtualListener(configuredController)
  const store = MIDIStructorUI.useStore(configuredController.name).useGet()
  const midiEmitter: MidiEmitter = {
    send: (m: MidiMessage) => {
      listener.emit(MidiMessage.raw(m))
    },
  }
  const [editWidgets, setEditWidgets] = React.useState(false)

  const updateWidgets: MIDIStructorUIWidgetsUpdate = (widgets) => {
    // @ts-ignore
    const updated = widgets(configuredController.config.widgets)
    const stringWidgets = SchemaHelper.encode(
      Schema.Struct({
        widgets: Schema.Array(AllMidiStructorWidgets.schema),
      }),
      { widgets: updated }
    )
    Either.match(ControllerConfig.parse(stringWidgets, MIDIStructorUI.device), {
      onRight: (widgets) => {
        // @ts-ignore
        setWidgets(widgets.widgets)
      },
      onLeft: (error) => {
        console.error(error)
        toast.error(error)
      },
    })
  }

  return (
    <Box>
      <MidiStructorEditWidgets
        editWidgets={editWidgets}
        toggleEditWidgets={() => setEditWidgets((e) => !e)}
        updateWidgets={updateWidgets}
        configuredController={configuredController}
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
  component: (configuredController, _, setWidgets) => {
    return (
      <MIDIStructorDeviceUIComponent
        configuredController={configuredController}
        setWidgets={setWidgets}
      />
    )
  },
  useStore: MIDIStructorUI.useStore,
})

export type MIDIStructorDeviceUI = typeof MIDIStructorDeviceUI
