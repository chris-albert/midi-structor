import React from 'react'
import { Box } from '@mui/material'
import { ControllerGridComponent } from './ControllerGridComponent'
import { LaunchPadMiniMk3UI } from './LaunchPadMiniMk3UI'
import { ConfiguredController } from '@midi-structor/core'

export type LaunchpadMiniComponentProps = {
  controller: ConfiguredController
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
        <ControllerGridComponent controller={controllerUI} />
      </Box>
    </Box>
  )
}
