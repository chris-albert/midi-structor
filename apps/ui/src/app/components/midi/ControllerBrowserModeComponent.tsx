import React from 'react'
import { Box } from '@mui/material'
import {
  ConfiguredController,
  ConfiguredControllerHooks,
  State,
} from '@midi-structor/core'
import { MidiDeviceSelectionComponent } from './MidiDeviceSelectionComponent'

export type ControllerBrowserModeComponentProps = {
  controllerState: State<ConfiguredController>
}

export const ControllerBrowserModeComponent: React.FC<
  ControllerBrowserModeComponentProps
> = ({ controllerState }) => {
  const deviceSelection =
    ConfiguredControllerHooks.useMidiDeviceSelection(controllerState)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}>
      <MidiDeviceSelectionComponent midiDevices={deviceSelection.input} />
      <MidiDeviceSelectionComponent midiDevices={deviceSelection.output} />
    </Box>
  )
}
