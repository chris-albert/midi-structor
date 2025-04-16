import { Controller } from '../Controller'
import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { ControllerWidgets } from '../ControllerWidgets'

export type ControllerDevice = {
  name: string
  controller: (emitter: MidiEmitter, listener: MidiListener, virtual: boolean) => Controller
  widgets: ControllerWidgets
}

const of = (device: ControllerDevice): ControllerDevice => device

export const ControllerDevice = {
  of,
}
