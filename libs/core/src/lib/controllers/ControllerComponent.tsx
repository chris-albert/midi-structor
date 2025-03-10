import React from 'react'
import { InfiniteBitsControllerComponent } from './InfiniteBitsControllerComponent'
import { LaunchPadMiniMk3 } from './devices/LaunchPadMiniMk3'
import {
  ConfiguredController,
  RealConfiguredController,
  VirtualConfiguredController,
} from './ConfiguredController'

type RealControllerComponentProps = {
  controller: RealConfiguredController
}

const RealControllerComponent: React.FC<RealControllerComponentProps> = ({ controller }) => {
  const io = ConfiguredController.useRealIO(controller)

  if (io.enabled) {
    return <InfiniteBitsControllerComponent controller={LaunchPadMiniMk3(io.emitter, io.listener)} />
  } else {
    return null
  }
}

type VirtualControllerComponentProps = {
  controller: VirtualConfiguredController
}

const VirtualControllerComponent: React.FC<VirtualControllerComponentProps> = ({ controller }) => {
  const io = ConfiguredController.useVirtualIO(controller)

  if (io.enabled) {
    return <InfiniteBitsControllerComponent controller={LaunchPadMiniMk3(io.emitter, io.listener)} />
  } else {
    return null
  }
}

export type ControllerComponentProps = {
  controller: ConfiguredController
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({ controller }) => {
  if (controller.type === 'virtual') {
    return <VirtualControllerComponent controller={controller} />
  } else {
    return <RealControllerComponent controller={controller} />
  }
}
