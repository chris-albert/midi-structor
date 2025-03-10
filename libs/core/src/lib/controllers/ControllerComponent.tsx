import React from 'react'
import { InfiniteBitsControllerComponent } from './InfiniteBitsControllerComponent'
import { LaunchPadMiniMk3 } from './devices/LaunchPadMiniMk3'
import { ConfiguredController } from './ConfiguredController'

export type ControllerComponentProps = {
  controller: ConfiguredController
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({ controller }) => {
  const io = ConfiguredController.useIO(controller)

  if (io.enabled) {
    return <InfiniteBitsControllerComponent controller={LaunchPadMiniMk3(io.emitter, io.listener)} />
  } else {
    return null
  }
}
