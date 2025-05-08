import React from 'react'
import { PrimitiveAtom } from 'jotai/index'
import { ConfiguredController, ControllerUIDevices } from '@midi-structor/core'
import { Box } from '@mui/material'
import { Option } from 'effect'

export type ControllerHomeComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerHomeComponent: React.FC<
  ControllerHomeComponentProps
> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)
  const devices = ControllerUIDevices.useDevices()

  return (
    <Box sx={{ mt: 2 }}>
      {Option.getOrElse(
        Option.map(devices.findByName(controller.device), (c) =>
          c.Component(controllerAtom, c)
        ),
        () => null
      )}
    </Box>
  )
}
