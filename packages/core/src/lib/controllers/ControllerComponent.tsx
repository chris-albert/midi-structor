import React from 'react'
import { LaunchPadMiniMk3 } from './devices/LaunchPadMiniMk3'
import {
  ConfiguredController,
  RealConfiguredController,
  VirtualConfiguredController,
} from './ConfiguredController'
import { ControllerConfigComponent } from './ControllerConfigComponent'

type RealControllerComponentProps = {
  controller: RealConfiguredController
}

const RealControllerComponent: React.FC<RealControllerComponentProps> = ({ controller }) => {
  const io = ConfiguredController.useRealIO(controller)
  const widgets = ConfiguredController.useResolvedWidgets(controller.config)

  if (io.enabled) {
    return (
      <ControllerConfigComponent
        controller={LaunchPadMiniMk3(io.emitter, io.listener, false)}
        name={controller.name}
        widgets={widgets}
      />
    )
  } else {
    return null
  }
}

type VirtualControllerComponentProps = {
  controller: VirtualConfiguredController
}

const VirtualControllerComponent: React.FC<VirtualControllerComponentProps> = ({ controller }) => {
  const io = ConfiguredController.useVirtualIO(controller)
  const widgets = ConfiguredController.useResolvedWidgets(controller.config)

  if (io.enabled) {
    return (
      <ControllerConfigComponent
        controller={LaunchPadMiniMk3(io.emitter, io.listener, true)}
        name={controller.name}
        widgets={widgets}
      />
    )
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
