import React from 'react'
import { Box } from '@mui/material'
import { LaunchpadMiniComponent } from './LaunchpadMiniComponent'
import { VirtualConfiguredController } from '@midi-structor/core'

export type VirtualControllerComponentProps = {
  controller: VirtualConfiguredController
}

export const VirtualControllerComponent: React.FC<VirtualControllerComponentProps> = ({ controller }) => {
  return (
    <Box>
      <LaunchpadMiniComponent controller={controller} />
    </Box>
  )
}
