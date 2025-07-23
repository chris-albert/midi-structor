import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { Color } from '../Color'
import { MidiChannel, MidiMessage } from '../../midi/MidiMessage'
import { Pad } from '../pads/Pad'
import { Schema } from 'effect'
import { DawMidi } from '../../midi/DawMidi'
import { MidiTarget } from '../../midi/MidiTarget'
import { SchemaForm } from './form/SchemaForm'
import { TextSchema } from './ButtonWidget'

export const MidiNoteOnVaryVelocity = Schema.TaggedStruct(
  'midi-note-vary-velocity',
  {
    note: Schema.Number,
    ...MidiChannel.fields,
  }
)

export const MidiNoteOnVaryNote = Schema.TaggedStruct('midi-note-vary-note', {
  velocity: Schema.Number,
  ...MidiChannel.fields,
})

export const MidiCCVaryData = Schema.TaggedStruct('midi-cc-vary-data', {
  controllerNumber: Schema.Number,
  ...MidiChannel.fields,
})

export const KnobMidi = Schema.Union(
  MidiNoteOnVaryNote,
  MidiNoteOnVaryVelocity,
  MidiCCVaryData
)

const getValueFromMessage = (
  target: MidiTarget,
  message: MidiMessage
): number => {
  return MidiTarget.match(target, {
    Note: () => (message.type === 'noteon' ? message.velocity : 0),
    CC: () => (message.type === 'cc' ? message.data : 0),
    PC: () => 0,
  })
}

const getOutputMessage = (
  knobMidi: typeof KnobMidi.Type,
  value: number
): MidiMessage => {
  if (knobMidi._tag === 'midi-note-vary-velocity') {
    return {
      type: 'noteon',
      note: knobMidi.note,
      channel: knobMidi.channel,
      velocity: value,
    }
  } else if (knobMidi._tag === 'midi-note-vary-note') {
    return {
      type: 'noteon',
      note: value,
      channel: knobMidi.channel,
      velocity: knobMidi.velocity,
    }
  } else {
    return {
      type: 'cc',
      controllerNumber: knobMidi.controllerNumber,
      channel: knobMidi.channel,
      data: value,
    }
  }
}

export const KnobWidget = ControllerWidget.one({
  name: 'knob',
  schema: Schema.Struct({
    color: Color.Schema,
    midi: KnobMidi,
    text: TextSchema,
  }),
  init: () => ({
    color: Color.GREEN,
    midi: {
      _tag: 'midi-note-vary-velocity' as const,
      note: 1,
      channel: 1,
    },
  }),
  component: ({ target, color, midi }) => {
    const dawEmitter = DawMidi.useDawEmitter()

    return (
      <Pad
        color={color}
        target={target}
        onClick={(message) => {
          const value = getValueFromMessage(target, message)
          const outputMessage = getOutputMessage(midi, value)
          dawEmitter.send(outputMessage)
        }}
      />
    )
  },
})
