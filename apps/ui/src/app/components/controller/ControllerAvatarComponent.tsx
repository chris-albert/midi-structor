import React from 'react'
import { PrimitiveAtom } from 'jotai'
import { ConfiguredController } from '@midi-structor/core'
import { StringAvatarComponent } from '../StringAvatarComponent'

export type ControllerAvatarComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerAvatarComponent: React.FC<ControllerAvatarComponentProps> = ({ controllerAtom }) => {
  const controllerName = ConfiguredController.useControllerName(controllerAtom)
  return (
    <StringAvatarComponent
      label={controllerName}
      size={35}
    />
  )
}
