import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { Controller } from '../Controller'
import { ControllerDevice } from './ControllerDevice'
import { MidiMessage } from '../../midi/MidiMessage'

const controller = (emitter: MidiEmitter, listener: MidiListener, virtual: boolean) =>
  new Controller({
    init: () => {},
    render: (pads) => {},
    listenFilter: (m: MidiMessage): boolean => true,
    listener,
    targets: [],
  })

export const MIDIStructorUI = ControllerDevice.of({
  name: 'MIDI Structor UI',
  controller,
})
