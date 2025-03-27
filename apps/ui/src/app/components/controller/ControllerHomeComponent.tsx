import React from 'react'
import { PrimitiveAtom } from 'jotai/index'
import { ConfiguredController } from '@midi-structor/core'
import { Box } from '@mui/material'
import { LaunchpadMiniComponent } from './LaunchpadMiniComponent'

export type ControllerHomeComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerHomeComponent: React.FC<ControllerHomeComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)

  return (
    <Box>
      <LaunchpadMiniComponent controller={controller.controller} />
    </Box>
  )
}
