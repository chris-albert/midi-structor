import React from 'react'
import { MidiRenderer } from '../renderer/MidiRenderer'
import { ControllersComponent } from './ControllersComponent'

export const ReactControllersApp = () => {
  MidiRenderer.render(<ControllersComponent />)
}
