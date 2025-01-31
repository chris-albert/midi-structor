import React from 'react'
import { MidiRenderer } from '../renderer/MidiRenderer'
import { InfiniteBitsControllerComponent } from './InfiniteBitsControllerComponent'

export const ReactReconcilerController = () => {
  MidiRenderer.render(<InfiniteBitsControllerComponent />)
  // MidiRenderer.render(<MyController />)
}
