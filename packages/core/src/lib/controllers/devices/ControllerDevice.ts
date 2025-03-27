import { Controller } from '../Controller'
import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'

export type ControllerDevice = {
  name: string
  controller: (emitter: MidiEmitter, listener: MidiListener, virtual: boolean) => Controller
}

const of = (device: ControllerDevice): ControllerDevice => device

export const ControllerDevice = {
  of,
}
