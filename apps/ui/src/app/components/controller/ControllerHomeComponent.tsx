import React from 'react'
import {
  ConfiguredController,
  ConfiguredControllerHooks,
  ControllerUIDevices,
  MIDIStructorUIWidgets,
  State,
} from '@midi-structor/core'
import { Box } from '@mui/material'
import { Option } from 'effect'

export type ControllerHomeComponentProps = {
  controllerState: State<ConfiguredController>
}

export const ControllerHomeComponent: React.FC<
  ControllerHomeComponentProps
> = ({ controllerState }) => {
  const controller = ConfiguredControllerHooks.useController(controllerState)
  const devices = ControllerUIDevices.useDevices()

  const setWidgets = (widgets: MIDIStructorUIWidgets) => {
    controller.setConfig({ widgets })
  }

  return (
    <Box sx={{ mt: 2 }}>
      {Option.getOrElse(
        Option.map(devices.findByName(controller.device), (c) =>
          c.component(controller.controller, c, setWidgets)
        ),
        () => null
      )}
    </Box>
  )
}
