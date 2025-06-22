import React from 'react'
import { ConfiguredController, State } from '@midi-structor/core'
import { StringAvatarComponent, stringToColor } from '../StringAvatarComponent'

export type ControllerAvatarComponentProps = {
  controllerState: State<ConfiguredController>
}

export const ControllerAvatarComponent: React.FC<
  ControllerAvatarComponentProps
> = ({ controllerState }) => {
  const controller = ConfiguredController.useController(controllerState)
  return (
    <StringAvatarComponent
      label={controller.name}
      color={controller.color || stringToColor(controller.name)}
      size={35}
    />
  )
}
