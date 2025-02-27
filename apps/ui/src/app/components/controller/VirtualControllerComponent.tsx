import React from 'react'
import { Box } from '@mui/material'
import { LaunchpadMiniComponent } from './LaunchpadMiniComponent'

export type VirtualControllerComponentProps = {}

export const VirtualControllerComponent: React.FC<VirtualControllerComponentProps> = ({}) => {
  return (
    <Box>
      <LaunchpadMiniComponent />
    </Box>
  )
}
