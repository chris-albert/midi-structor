import { Controller } from '../Controller'
import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { ControllerWidgets } from '../ControllerWidgets'

export type ControllerDevice = {
  name: string
  controller: (emitter: MidiEmitter, listener: MidiListener, virtual: boolean) => Controller
  widgets: ControllerWidgets
}

const of = (device: ControllerDevice): ControllerDevice => device

const empty: ControllerDevice = {
  name: 'empty',
  controller: (e, l) => Controller.empty,
  widgets: ControllerWidgets([]),
}

export const ControllerDevice = {
  of,
  empty,
}
