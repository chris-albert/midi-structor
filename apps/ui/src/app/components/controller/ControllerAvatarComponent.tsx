import React from 'react'
import { PrimitiveAtom } from 'jotai'
import { ConfiguredController } from '@midi-structor/core'
import { StringAvatarComponent, stringToColor } from '../StringAvatarComponent'

export type ControllerAvatarComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerAvatarComponent: React.FC<ControllerAvatarComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)
  return (
    <StringAvatarComponent
      label={controller.name}
      color={controller.color || stringToColor(controller.name)}
      size={35}
    />
  )
}
