import React from 'react'
import { Box } from '@mui/material'
import { LaunchpadMiniComponent } from './LaunchpadMiniComponent'
import { ConfiguredController } from '@midi-structor/core'

export type VirtualControllerComponentProps = {
  controller: ConfiguredController
}

export const VirtualControllerComponent: React.FC<VirtualControllerComponentProps> = ({ controller }) => {
  return (
    <Box>
      <LaunchpadMiniComponent controller={controller} />
    </Box>
  )
}
