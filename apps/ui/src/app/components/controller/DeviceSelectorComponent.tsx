import React from 'react'
import { ConfiguredController, ControllerDevices } from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'
import { Card, CardContent, CardHeader } from '@mui/material'
import { SelectComponent, SelectItem } from '../SelectComponent'

export type DeviceSelectorComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const DeviceSelectorComponent: React.FC<DeviceSelectorComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)

  const deviceItems: Array<SelectItem> = ControllerDevices.getNames().map((name) => ({
    label: name,
    value: name,
  }))

  return (
    <Card>
      <CardHeader title='Device Setup' />
      <CardContent>
        <SelectComponent
          label='Device'
          activeLabel={controller.device}
          items={deviceItems}
          onChange={(d) => controller.setDevice(d || '')}
        />
      </CardContent>
    </Card>
  )
}
