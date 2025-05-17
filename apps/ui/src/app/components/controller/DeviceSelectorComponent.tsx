import React from 'react'
import { ConfiguredController, ControllerDevices } from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'
import { SelectComponent, SelectItem } from '../form/SelectComponent'

export type DeviceSelectorComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const DeviceSelectorComponent: React.FC<
  DeviceSelectorComponentProps
> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)

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
