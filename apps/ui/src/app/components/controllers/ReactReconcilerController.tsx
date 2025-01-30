import React from 'react'
import { MidiRenderer } from '../../renderer/MidiRenderer'
import { InfiniteBitsControllerComponent } from './InfiniteBitsControllerComponent'
import { MyController } from './MyTestController'

export const ReactReconcilerController = () => {
  MidiRenderer.render(<InfiniteBitsControllerComponent />)
  // MidiRenderer.render(<MyController />)
}
