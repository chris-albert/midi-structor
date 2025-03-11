import React from 'react'
import { Box } from '@mui/material'
import { ControllerGridComponent } from './ControllerGridComponent'
import { LaunchPadMiniMk3UI } from './LaunchPadMiniMk3UI'
import { VirtualConfiguredController } from '@midi-structor/core'

export type LaunchpadMiniComponentProps = {
  controller: VirtualConfiguredController
}

export const LaunchpadMiniComponent: React.FC<LaunchpadMiniComponentProps> = ({ controller }) => {
  const controllerUI = LaunchPadMiniMk3UI()

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
        p: 2,
      }}>
      <Box>
        <ControllerGridComponent
          controllerUI={controllerUI}
          controller={controller}
        />
      </Box>
    </Box>
  )
}
