import React from 'react'
import { Box } from '@mui/material'
import { ControllerMidiComponent } from '../midi/ControllerMidiComponent'

export type RealControllerComponentProps = {}

export const RealControllerComponent: React.FC<RealControllerComponentProps> = ({}) => {
  return (
    <Box>
      <ControllerMidiComponent />
    </Box>
  )
}
