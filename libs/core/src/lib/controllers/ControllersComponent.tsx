import React from 'react'
import { ConfiguredController } from './ConfiguredController'
import { ControllerComponent } from './ControllerComponent'

export type ControllersComponentProps = {}

export const ControllersComponent: React.FC<ControllersComponentProps> = ({}) => {
  const [controllers] = ConfiguredController.useControllers()

  return controllers.map((controller) => (
    <ControllerComponent
      key={`controller-${controller.name}`}
      controller={controller}
    />
  ))
}
