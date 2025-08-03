import {
  KnobMidi,
  MidiCCVaryData,
  MidiNoteOnVaryNote,
  MidiNoteOnVaryVelocity,
} from '@midi-structor/core'
import React from 'react'
import { SelectComponent, SelectItem } from '../../form/SelectComponent'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'
import { Box } from '@mui/material'
import _ from 'lodash'

const MidiItems: Array<SelectItem> = [
  {
    label: 'Note (Vary Velocity)',
    value: 'midi-note-vary-velocity',
  },
  {
    label: 'Note (Vary Note)',
    value: 'midi-note-vary-note',
  },
  {
    label: 'CC (Vary Data)',
    value: 'midi-cc-vary-data',
  },
]

const MidiValueItems: Array<SelectItem<number>> = Array.from({
  length: 128,
}).map((_, i) => ({
  label: i.toString(),
  value: i,
}))

const MidiChannelItems: Array<SelectItem<number>> = Array.from({
  length: 16,
}).map((_, i) => ({
  label: i.toString(),
  value: i,
}))

export type KnobFieldComponentProps = {
  value: KnobMidi
  onChange: (value: KnobMidi) => void
}

export const KnobFieldComponent: React.FC<KnobFieldComponentProps> = ({
  value,
  onChange,
}) => {
  const [knobType, setKnobType] = React.useState<string | undefined>(
    'midi-cc-vary-data'
  )

  const maybeActiveKnobTypeLabel = _.find(
    MidiItems,
    (i) => i.value === knobType
  )

  const activeKnobTypeLabel = maybeActiveKnobTypeLabel
    ? maybeActiveKnobTypeLabel.label
    : undefined

  const [midiValue, setMidiValue] = React.useState<number | undefined>(
    undefined
  )
  const activeValueLabel =
    midiValue !== undefined ? midiValue.toString() : undefined

  const [midiChannel, setMidiChannel] = React.useState<number | undefined>(
    undefined
  )

  const activeMidiChannel =
    midiChannel !== undefined ? midiChannel.toString() : undefined

  const [valueLabel, setValueLabel] = React.useState<string>('')

  React.useEffect(() => {
    if (midiValue !== undefined && midiChannel !== undefined) {
      if (knobType === 'midi-note-vary-velocity') {
        onChange(
          MidiNoteOnVaryVelocity.make({ note: midiValue, channel: midiChannel })
        )
      } else if (knobType === 'midi-note-vary-note') {
        onChange(
          MidiNoteOnVaryNote.make({ velocity: midiValue, channel: midiChannel })
        )
      } else if (knobType === 'midi-cc-vary-data') {
        onChange(
          MidiCCVaryData.make({
            controllerNumber: midiValue,
            channel: midiChannel,
          })
        )
      }
    }
  }, [knobType, midiValue, midiChannel])

  React.useEffect(() => {
    if (knobType === 'midi-note-vary-velocity') {
      setValueLabel('Note')
    } else if (knobType === 'midi-note-vary-note') {
      setValueLabel('Velocity')
    } else if (knobType === 'midi-cc-vary-data') {
      setValueLabel('Control Number')
    }
  }, [knobType])

  React.useEffect(() => {
    setKnobType(value._tag)
    if (value._tag === 'midi-note-vary-velocity') {
      setMidiValue(value.note)
      setMidiChannel(value.channel)
    } else if (value._tag === 'midi-note-vary-note') {
      setMidiValue(value.velocity)
      setMidiChannel(value.channel)
    } else if (value._tag === 'midi-cc-vary-data') {
      setMidiValue(value.controllerNumber)
      setMidiChannel(value.channel)
    }
  }, [value])

  return (
    <GroupedInputWithLabelComponent label='Knob Control'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
        <SelectComponent
          label='Type'
          items={MidiItems}
          onChange={setKnobType}
          activeLabel={activeKnobTypeLabel}
        />
        <SelectComponent
          label={valueLabel}
          items={MidiValueItems}
          onChange={setMidiValue}
          activeLabel={activeValueLabel}
        />
        <SelectComponent
          label='Channel'
          items={MidiChannelItems}
          onChange={setMidiChannel}
          activeLabel={activeMidiChannel}
        />
      </Box>
    </GroupedInputWithLabelComponent>
  )
}
