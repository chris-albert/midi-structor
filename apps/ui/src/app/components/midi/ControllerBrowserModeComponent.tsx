import React from 'react'
import { Box } from '@mui/material'
import { MidiSelectComponent } from './MidiSelectComponent'

export type ControllerBrowserModeComponentProps = {}

export const ControllerBrowserModeComponent: React.FC<ControllerBrowserModeComponentProps> = ({}) => {
  return (
    <Box>
      <MidiSelectComponent
        midiType='controller'
        midiDeviceType='input'
      />
      <MidiSelectComponent
        midiType='controller'
        midiDeviceType='output'
      />
    </Box>
  )
}
