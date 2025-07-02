import React from 'react'
import { ConfiguredController } from './ConfiguredController'
import { ControllerConfigComponent } from './ControllerConfigComponent'
import { ControllerDevices } from './devices/ControllerDevices'
import { Option } from 'effect'
import { ControllerInstance } from './ControllerInstance'
import { ConfiguredControllerHooks } from './ConfiguredControllerHooks'

export type ControllerComponentProps = {
  controller: ConfiguredController
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({
  controller,
}) => {
  const io = ConfiguredControllerHooks.useIO(controller)
  const device = ControllerDevices.findByName(controller.device)

  if (io.enabled && Option.isSome(device)) {
    return (
      <ControllerConfigComponent
        controller={ControllerInstance.of(
          controller,
          device.value.controller,
          io.emitter,
          io.listener
        )}
        name={controller.name}
        widgets={device.value.widgets.resolve(controller.config)}
      />
    )
  } else {
    return null
  }
}
