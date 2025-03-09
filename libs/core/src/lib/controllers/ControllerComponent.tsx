import React from 'react'
import { Midi } from '../midi/GlobalMidi'
import { InfiniteBitsControllerComponent } from './InfiniteBitsControllerComponent'
import { LaunchPadMiniMk3 } from './devices/LaunchPadMiniMk3'
import { ProjectMidi } from '../project/ProjectMidi'
import { ProjectHooks } from '../project/ProjectHooks'

export type ControllerComponentProps = {}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({}) => {
  const emitter = Midi.useControllerEmitter()
  const listener = Midi.useControllerListener()
  const enabled = Midi.useControllerEnabled()

  ProjectMidi.useProjectListener()

  ProjectHooks.useOnStatusChange((status) => {
    if (status === 'importing') {
      console.log('Importing new project.')
    } else if (status === 'done') {
      console.log(`Successfully imported project!`)
    }
  })

  if (enabled) {
    return <InfiniteBitsControllerComponent controller={LaunchPadMiniMk3(emitter, listener)} />
  } else {
    return null
  }
}
