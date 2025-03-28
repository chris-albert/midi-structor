import React from 'react'
import { ConfiguredController, ControllerDevice } from '@midi-structor/core'

export type ControllerUIDevice = {
  controller: ControllerDevice
  component: (controller: ConfiguredController) => React.ReactElement
}

const of = (device: ControllerUIDevice): ControllerUIDevice => device

export const ControllerUIDevice = {
  of,
}
