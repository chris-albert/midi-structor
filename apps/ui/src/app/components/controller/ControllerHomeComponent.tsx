import React from 'react'
import { PrimitiveAtom } from 'jotai/index'
import {
  ConfiguredController,
  ControllerUIDevices,
  MIDIStructorUIWidgets,
  MIDIStructorUIWidgetsUpdate,
} from '@midi-structor/core'
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
