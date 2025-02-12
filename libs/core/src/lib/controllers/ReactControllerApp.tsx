import React from 'react'
import { MidiRenderer } from '../renderer/MidiRenderer'
import { ControllerComponent } from './ControllerComponent'

export const ReactControllerApp = () => {
  MidiRenderer.render(<ControllerComponent />)
}
