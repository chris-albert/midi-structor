import { Controller } from '../Controller'
import { ControllerDevice } from './ControllerDevice'
import { MidiMessage } from '../../midi/MidiMessage'
import { Schema } from 'effect'
import {
  ControllerWidget,
  ControllerWidgetsType,
  ResolvedControllerWidget,
  WidgetInput,
} from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { AllMidiStructorWidgets } from './midistructor/widgets/AllMidiStructorWidgets'
import { MIDIStructorPad, MidiStructorUIInit } from './MidiStructorMessage'
import { MidiStructorMidi } from './MidiStructorMidi'

const widgets = AllMidiStructorWidgets.controller

type ElementType<T> = T extends (infer U)[] ? U : never

export type MIDIStructorUIWidgets = ControllerWidgetsType<
  typeof widgets.widgets
>

export type MIDIStructorUIWidgetsUpdate = (
  wu: (w: MIDIStructorUIWidgets) => MIDIStructorUIWidgets
) => void

export type MIDIStructorUIWidget = ElementType<MIDIStructorUIWidgets>

export const MIDIStructorResend = Schema.TaggedStruct('resend', {})

const controller = Controller.of({
  init: (emitter) => (widgets) => {
    const uiWidgets = MidiStructorUIInit.make({
      widgets: widgets.map((w) => w.widget),
    })
    emitter.send(
      MidiMessage.jsonSchemaSysex(
        uiWidgets,
        MidiStructorUIInit,
        [MidiStructorMidi.sysexControlCode],
        MidiStructorMidi.manufacturer
      )
    )
  },
  render: (emitter) => (pads) => {
    pads.forEach((pad) => {
      emitter.send(
        MidiMessage.jsonSchemaSysex(
          MIDIStructorPad.make({
            target: pad.target,
            color: pad.color,
            options: pad.options,
          }),
          MIDIStructorPad,
          [MidiStructorMidi.sysexControlCode]
        )
      )
    })
  },
  targets: [],
})

const device = ControllerDevice.of({
  name: 'MIDI Structor UI',
  controller,
  widgets,
})

export type MidiStructorUIDevice = typeof device

const getWidgetInput = (
  widget: ControllerWidget,
  widgets: Array<ResolvedControllerWidget>,
  count: number
): WidgetInput => {
  const targets = widgets.flatMap((w) => w.targets())
  console.log('targets', targets)
  const targetsSet = new Set(targets.map(MidiTarget.toKey))
  const getNext = (): MidiTarget => {
    const find = MidiTarget.allTargets.find(
      (t) => !targetsSet.has(MidiTarget.toKey(t))
    )
    if (find !== undefined) {
      targetsSet.add(MidiTarget.toKey(find))
      return find
    } else {
      console.error('Ran out of Midi targets')
      throw new Error('Ran out of Midi targets')
    }
  }

  if (widget.inputType === 'none') {
    return { _tag: 'none' }
  } else if (widget.inputType === 'one') {
    return { _tag: 'one', target: getNext() }
  } else {
    return {
      _tag: 'many',
      targets: Array.from({ length: count }, (i) => getNext()),
    }
  }
}

export const MIDIStructorUI = {
  device,
  getWidgetInput,
  widgets,
}
