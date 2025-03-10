import React from 'react'
import { Box } from '@mui/material'
import { PrimitiveAtom } from 'jotai/index'
import { ConfiguredController, RealConfiguredController } from '@midi-structor/core'
import { MidiDeviceSelectionComponent } from './MidiDeviceSelectionComponent'

export type ControllerBrowserModeComponentProps = {
  controllerAtom: PrimitiveAtom<RealConfiguredController>
}

export const ControllerBrowserModeComponent: React.FC<ControllerBrowserModeComponentProps> = ({
  controllerAtom,
}) => {
  const deviceSelection = ConfiguredController.useMidiDeviceSelection(controllerAtom)
  return (
    <Box>
      <MidiDeviceSelectionComponent midiDevices={deviceSelection.input} />
      <MidiDeviceSelectionComponent midiDevices={deviceSelection.output} />
    </Box>
  )
}
