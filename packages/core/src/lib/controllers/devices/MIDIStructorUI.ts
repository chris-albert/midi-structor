import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { Controller } from '../Controller'
import { ControllerDevice } from './ControllerDevice'
import { MidiMessage } from '../../midi/MidiMessage'
import { ControllerWidgets } from '../ControllerWidgets'
import { PlayStopWidget } from '../widgets/PlayStopWidget'
import { Schema } from 'effect'
import { ControllerWidget, ControllerWidgetsType } from '../ControllerWidget'
import { BeatsWidget } from '../widgets/BeatsWidget'

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
    init: (widgets) => {
      console.log('MidiStructor UI widgets', widgets)
      widgets.forEach((widget) => emitter.send(MidiMessage.jsonSysex(widget)))
    },
    render: (pads) => {},
    listenFilter: (m: MidiMessage): boolean => true,
    listener,
    targets: [],
  })

const widgets = ControllerWidgets([
  ControllerWidget.intersect(PlayStopWidget, UIBaseSchema),
  ControllerWidget.intersect(BeatsWidget, UIBaseSchema),
])

type ElementType<T> = T extends (infer U)[] ? U : never

export type MIDIStructorUIWidgets = ControllerWidgetsType<typeof widgets.widgets>
export type MIDIStructorUIWidget = ElementType<MIDIStructorUIWidgets>

const device = ControllerDevice.of({
  name: 'MIDI Structor UI',
  controller,
  widgets,
})

export type MidiStructorUIDevice = typeof device

export const MIDIStructorUI = {
  device,
}
