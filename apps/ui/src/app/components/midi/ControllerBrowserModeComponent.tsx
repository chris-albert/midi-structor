import React from 'react'
import { Box } from '@mui/material'
import { PrimitiveAtom } from 'jotai/index'
import { ConfiguredController } from '@midi-structor/core'
import { MidiDeviceSelectionComponent } from './MidiDeviceSelectionComponent'

export type ControllerBrowserModeComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerBrowserModeComponent: React.FC<
  ControllerBrowserModeComponentProps
> = ({ controllerAtom }) => {
  const deviceSelection =
    ConfiguredController.useMidiDeviceSelection(controllerAtom)
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
