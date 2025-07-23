import React from 'react'
import { MidiTarget } from '@midi-structor/core'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'
import { MidiTargetFieldComponent } from './MidiTargetFieldComponent'

export type MidiTargetsFieldComponentProps = {
  targets: Array<MidiTarget>
  onChange: (targets: Array<MidiTarget>) => void
}

export const MidiTargetsFieldComponent: React.FC<
  MidiTargetsFieldComponentProps
> = ({ targets, onChange }) => {
  return (
    <GroupedInputWithLabelComponent label='MIDI Targets'>
      {targets.map((target, index) => (
        <MidiTargetFieldComponent
          key={index}
          label={`MIDI Target - ${index + 1}`}
          target={target}
          onChange={() => {}}
        />
      ))}
    </GroupedInputWithLabelComponent>
  )
}
