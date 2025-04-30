import { Controller } from '../Controller'
import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { ControllerWidgets } from '../ControllerWidgets'
import { ControllerWidget } from '../ControllerWidget'

export type ControllerDevice<Widgets extends Array<ControllerWidget> = any> = {
  name: string
  controller: (
    emitter: MidiEmitter,
    listener: MidiListener,
    virtual: boolean
  ) => Controller
  widgets: ControllerWidgets<Widgets>
}

const of = <Widgets extends Array<ControllerWidget>>(
  device: ControllerDevice<Widgets>
): ControllerDevice<Widgets> => device

const empty: ControllerDevice<[]> = {
  name: 'empty',
  controller: (e, l) => Controller.empty,
  widgets: ControllerWidgets([]),
}

export const ControllerDevice = {
  of,
  empty,
}
