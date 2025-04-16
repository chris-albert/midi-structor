import React from 'react'
import { ConfiguredController } from './ConfiguredController'
import { ControllerConfigComponent } from './ControllerConfigComponent'
import { ControllerDevices } from './devices/ControllerDevices'
import { Option } from 'effect'

export type ControllerComponentProps = {
  controller: ConfiguredController
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({ controller }) => {
  const io = ConfiguredController.useIO(controller)
  const device = ControllerDevices.findByName(controller.device)

  if (io.enabled && Option.isSome(device)) {
    return (
      <ControllerConfigComponent
        controller={device.value.controller(io.emitter, io.listener, false)}
        name={controller.name}
        widgets={device.value.widgets.resolve(controller.config)}
      />
    )
  } else {
    return null
  }
}
