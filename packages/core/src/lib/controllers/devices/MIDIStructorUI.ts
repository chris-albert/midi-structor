import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { Controller } from '../Controller'
import { ControllerDevice } from './ControllerDevice'
import { MidiMessage } from '../../midi/MidiMessage'
import { ControllerWidgets } from '../ControllerWidgets'
import { PlayStopWidget } from '../widgets/PlayStopWidget'
import { Schema } from 'effect'
import { ControllerWidget, ControllerWidgetsType } from '../ControllerWidget'
import { BeatsWidget } from '../widgets/BeatsWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { ActiveClipWidget } from '../widgets/ActiveClipWidget'

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

const widgets = ControllerWidgets([
  ControllerWidget.intersect(PlayStopWidget, UIBaseSchema),
  ControllerWidget.intersect(BeatsWidget, UIBaseSchema),
  ControllerWidget.intersect(ActiveClipWidget, UIBaseSchema),
])

type ElementType<T> = T extends (infer U)[] ? U : never

export type MIDIStructorUIWidgets = ControllerWidgetsType<
  typeof widgets.widgets
>
export type MIDIStructorUIWidget = ElementType<MIDIStructorUIWidgets>

export const MidiStructorUIInit = Schema.TaggedStruct('init', {
  widgets: Schema.Array(widgets.schema),
})

export const MIDIStructorPad = Schema.TaggedStruct('pad', {
  target: MidiTarget.Schema,
  color: Color.Schema,
  options: Schema.optional(Schema.Any),
})

export type MIDIStructorPad = typeof MIDIStructorPad.Type

export const MIDIStructorMessage = Schema.Union(
  MidiStructorUIInit,
  MIDIStructorPad
)
export type MIDIStructorMessage = typeof MIDIStructorMessage.Type

export const MidiStructorSysexControlCode = 50
export const MidiStructorUIManufacturer = 0x03

const controller = (
  emitter: MidiEmitter,
  listener: MidiListener,
  virtual: boolean
) =>
  new Controller({
    init: (widgets) => {
      const uiWidgets = MidiStructorUIInit.make({
        widgets: widgets.map((w) => w.widget),
      })
      console.log('MidiStructor UI widgets', uiWidgets)
      emitter.send(
        MidiMessage.jsonSchemaSysex(
          uiWidgets,
          MidiStructorUIInit,
          [MidiStructorSysexControlCode],
          MidiStructorUIManufacturer
        )
      )
    },
    render: (pads) => {
      pads.forEach((pad) => {
        emitter.send(
          MidiMessage.jsonSchemaSysex(
            MIDIStructorPad.make({
              target: pad.target,
              color: pad.color,
              options: pad.options,
            }),
            MIDIStructorPad,
            [MidiStructorSysexControlCode]
          )
        )
      })
    },
    listenFilter: (m: MidiMessage): boolean => true,
    listener,
    targets: [],
  })

const device = ControllerDevice.of({
  name: 'MIDI Structor UI',
  controller,
  widgets,
})

export type MidiStructorUIDevice = typeof device

export const MIDIStructorUI = {
  device,
}
