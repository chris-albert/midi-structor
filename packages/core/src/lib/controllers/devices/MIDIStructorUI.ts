import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { Controller } from '../Controller'
import { ControllerDevice } from './ControllerDevice'
import { MidiMessage } from '../../midi/MidiMessage'
import { ControllerWidgets } from '../ControllerWidgets'
import { PlayStopWidget } from '../widgets/PlayStopWidget'
import { Schema } from 'effect'
import { ControllerWidget } from '../ControllerWidget'

const UIBaseSchema = Schema.Struct({
  label: Schema.optional(Schema.String),
  border: Schema.optional(
    Schema.Struct({
      sizePx: Schema.optional(Schema.Number),
      color: Schema.optional(Schema.String),
    })
  ),
  visible: Schema.optional(Schema.Boolean),
})

const controller = (emitter: MidiEmitter, listener: MidiListener, virtual: boolean) =>
  new Controller({
    init: () => {},
    render: (pads) => {},
    listenFilter: (m: MidiMessage): boolean => true,
    listener,
    targets: [],
  })

const widgets = ControllerWidgets([ControllerWidget.intersect(PlayStopWidget, UIBaseSchema)])

const device = ControllerDevice.of({
  name: 'MIDI Structor UI',
  controller,
  widgets,
})

export const MIDIStructorUI = {
  device,
}
