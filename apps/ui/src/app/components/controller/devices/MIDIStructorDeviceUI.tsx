import React from 'react'
import { ControllerUIDevice } from './ControllerUIDevice'
import { MIDIStructorUI } from '@midi-structor/core'
import { Box } from '@mui/material'

export const MIDIStructorDeviceUI = ControllerUIDevice.of({
  controller: MIDIStructorUI,
  component: (configuredController) => {
    return <Box>hi</Box>
  },
})
