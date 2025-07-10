import React from 'react'
import { ConfiguredController } from './ConfiguredController'
import { ControllerConfigComponent } from './ControllerConfigComponent'
import { ControllerDevices } from './devices/ControllerDevices'
import { Option } from 'effect'
import { ControllerInstance } from './ControllerInstance'
import {
  ConfiguredControllerHooks,
  ConfiguredControllerIO,
} from './ConfiguredControllerHooks'

export type ControllerComponentProps = {
  controller: ConfiguredController
  io: ConfiguredControllerIO
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({
  controller,
  io,
}) => {
  const controllerIO = ConfiguredControllerHooks.useIO(controller, io)
  const device = ControllerDevices.findByName(controller.device)

  if (controller.enabled && Option.isSome(device)) {
    return (
      <ControllerConfigComponent
        controller={ControllerInstance.of(
          controller,
          device.value.controller,
          controllerIO.emitter,
          controllerIO.listener
        )}
        name={controller.name}
        widgets={device.value.widgets.resolve(controller.config)}
      />
    )
  } else {
    return null
  }
}
