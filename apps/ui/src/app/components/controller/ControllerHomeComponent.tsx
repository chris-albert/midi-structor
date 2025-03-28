import React from 'react'
import { PrimitiveAtom } from 'jotai/index'
import { ConfiguredController } from '@midi-structor/core'
import { Box } from '@mui/material'
import { ControllerUIDevices } from './devices/ControllerUIDevices'
import { Option } from 'effect'

export type ControllerHomeComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerHomeComponent: React.FC<ControllerHomeComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)

  return (
    <Box sx={{ mt: 2 }}>
      {Option.getOrElse(
        Option.map(ControllerUIDevices.findByName(controller.device), (c) =>
          c.component(controller.controller)
        ),
        () => null
      )}
    </Box>
  )
}
