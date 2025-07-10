import React from 'react'
import { ConfiguredControllerHooks } from './ConfiguredControllerHooks'
import { ControllerComponent } from './ControllerComponent'
import { log } from '../logger/log'
import { MidiEmitter } from '../midi/MidiEmitter'
import { MidiListener } from '../midi/MidiListener'

export type ControllersComponentProps = {}

export const ControllersComponent: React.FC<
  ControllersComponentProps
> = ({}) => {
  const controllers = ConfiguredControllerHooks.useControllers()

  log.info('Controllers', controllers)

  return controllers.map((controller) => (
    <ControllerComponent
      key={`controller-${controller.name}`}
      controller={controller}
      io={{
        emitter: MidiEmitter.empty(),
        listener: MidiListener.empty(),
      }}
    />
  ))
}
