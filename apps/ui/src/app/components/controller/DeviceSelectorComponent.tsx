import React from 'react'
import {
  ConfiguredController,
  ControllerDevices,
  State,
} from '@midi-structor/core'
import { SelectComponent, SelectItem } from '../form/SelectComponent'

export type DeviceSelectorComponentProps = {
  controllerState: State<ConfiguredController>
}

export const DeviceSelectorComponent: React.FC<
  DeviceSelectorComponentProps
> = ({ controllerState }) => {
  const controller = ConfiguredController.useController(controllerState)

  const deviceItems: Array<SelectItem> = ControllerDevices.getNames().map(
    (name) => ({
      label: name,
      value: name,
    })
  )

  return (
    <SelectComponent
      label='Device'
      activeLabel={controller.device}
      items={deviceItems}
      onChange={(d) => controller.setDevice(d || '')}
    />
  )
}
