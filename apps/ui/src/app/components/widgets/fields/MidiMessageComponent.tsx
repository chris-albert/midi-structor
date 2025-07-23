import React from 'react'
import { SelectComponent, SelectItem } from '../../form/SelectComponent'
import { MidiMessage } from '@midi-structor/core'
import { Box } from '@mui/material'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'
import _ from 'lodash'

const TargetItems: Array<SelectItem> = [
  {
    label: 'Note',
    value: 'noteon',
  },
  {
    label: 'Control Change',
    value: 'cc',
  },
  {
    label: 'Program Change',
    value: 'pc',
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

export type MidiMessageComponentProps = {
  label?: string
  value: MidiMessage
  onChange: (value: MidiMessage) => void
}

export const MidiMessageComponent: React.FC<MidiMessageComponentProps> = ({
  label,
  value,
  onChange,
}) => {
  const [midiType, setMidiType] = React.useState<string | undefined>(undefined)

  const maybeMidiTypeLabel = _.find(TargetItems, (i) => i.value === midiType)
  const activeMidiTypeLabel =
    maybeMidiTypeLabel !== undefined ? maybeMidiTypeLabel.label : undefined

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
    if (midiType === 'noteon') {
      setValueLabel('Note')
    } else if (midiType === 'cc') {
      setValueLabel('Control Number')
    } else if (midiType === 'pc') {
      setValueLabel('Program Number')
    }
  }, [midiType])

  React.useEffect(() => {
    setMidiType(value.type)
    if (value.type === 'noteon') {
      setMidiValue(value.note)
      setMidiChannel(value.channel)
    } else if (value.type === 'cc') {
      setMidiValue(value.controllerNumber)
      setMidiChannel(value.channel)
    } else if (value.type === 'pc') {
      setMidiValue(value.programNumber)
      setMidiChannel(value.channel)
    }
  }, [value])

  return (
    <GroupedInputWithLabelComponent label={label || 'MIDI Message'}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
        <SelectComponent
          label='Type'
          items={TargetItems}
          onChange={setMidiType}
          activeLabel={activeMidiTypeLabel}
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
