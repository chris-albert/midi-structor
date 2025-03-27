import React from 'react'
import { LaunchPadMiniMk3 } from './devices/LaunchPadMiniMk3'
import { ConfiguredController } from './ConfiguredController'
import { ControllerConfigComponent } from './ControllerConfigComponent'

export type ControllerComponentProps = {
  controller: ConfiguredController
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({ controller }) => {
  const io = ConfiguredController.useIO(controller)
  const widgets = ConfiguredController.useResolvedWidgets(controller.config)

  if (io.enabled) {
    return (
      <ControllerConfigComponent
        controller={LaunchPadMiniMk3.controller(io.emitter, io.listener, false)}
        name={controller.name}
        widgets={widgets}
      />
    )
  } else {
    return null
  }
}
