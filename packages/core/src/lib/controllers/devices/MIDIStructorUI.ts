import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { Controller } from '../Controller'
import { ControllerDevice } from './ControllerDevice'
import { MidiMessage } from '../../midi/MidiMessage'
import { ControllerWidgets } from '../ControllerWidgets'
import { PlayStopWidget } from '../widgets/PlayStopWidget'
import { Schema } from 'effect'
import { ControllerWidget, ControllerWidgetsType, ControllerWidgetType } from '../ControllerWidget'
import { BeatsWidget } from '../widgets/BeatsWidget'
import { MidiTarget } from '../../midi/MidiTarget'

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

const w = [
  ControllerWidget.intersect(PlayStopWidget, UIBaseSchema),
  ControllerWidget.intersect(BeatsWidget, UIBaseSchema),
]

type MIDIStructorUIWidgets = ControllerWidgetsType<typeof w>

// const doStuff = (widgets: MIDIStructorUIWidgets) => {
//   widgets.map((w) => {
//     if (w._tag === 'play-stop') {
//       w.playColor
//     }
//   })
// }

const widgets = ControllerWidgets([
  ControllerWidget.intersect(PlayStopWidget, UIBaseSchema),
  ControllerWidget.intersect(BeatsWidget, UIBaseSchema),
])

const device = ControllerDevice.of({
  name: 'MIDI Structor UI',
  controller,
  widgets,
})

export const MIDIStructorUI = {
  device,
}
