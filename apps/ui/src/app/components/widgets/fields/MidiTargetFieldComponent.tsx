import React from 'react'
import { MidiTarget } from '@midi-structor/core'
import { Box, Typography } from '@mui/material'
import { SelectComponent, SelectItem } from '../../form/SelectComponent'
import _ from 'lodash'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'

const TargetItems: Array<SelectItem> = [
  {
    label: 'Note',
    value: 'Note',
  },
  {
    label: 'Control Change',
    value: 'CC',
  },
  {
    label: 'Program Change',
    value: 'PC',
  },
]
const MidiValueItems: Array<SelectItem<number>> = Array.from({
  length: 128,
}).map((_, i) => ({
  label: i.toString(),
  value: i,
}))

export type MidiTargetFieldComponentProps = {
  target: MidiTarget
  onChange: (t: MidiTarget) => void
}

export const MidiTargetFieldComponent: React.FC<
  MidiTargetFieldComponentProps
> = ({ target, onChange }) => {
  const [targetType, setTargetType] = React.useState<string | undefined>(
    undefined
  )

  const [targetValue, setTargetValue] = React.useState<number | undefined>(
    undefined
  )

  const maybeTypeLabel = _.find(TargetItems, (i) => i.value === targetType)
  const activeTypeLabel =
    maybeTypeLabel !== undefined ? maybeTypeLabel.label : undefined

  const activeValueLabel =
    targetValue !== undefined ? targetValue.toString() : undefined

  React.useEffect(() => {
    setTargetType(target._tag)
    setTargetValue(MidiTarget.toValue(target))
  }, [target])

  React.useEffect(() => {
    if (targetValue !== undefined) {
      if (targetType === 'Note') {
        onChange(MidiTarget.note(targetValue))
      } else if (targetType === 'CC') {
        onChange(MidiTarget.cc(targetValue))
      } else if (targetType === 'PC') {
        onChange(MidiTarget.pc(targetValue))
      }
    }
  }, [targetType, targetValue])

  return (
    <GroupedInputWithLabelComponent label='MIDI Target'>
      <SelectComponent
        label='Target Type'
        items={TargetItems}
        onChange={setTargetType}
        activeLabel={activeTypeLabel}
      />
      <SelectComponent
        label='Value'
        items={MidiValueItems}
        onChange={setTargetValue}
        activeLabel={activeValueLabel}
      />
    </GroupedInputWithLabelComponent>
  )
}
