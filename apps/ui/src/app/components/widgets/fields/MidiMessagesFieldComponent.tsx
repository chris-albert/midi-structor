import React from 'react'
import { MidiMessage } from '@midi-structor/core'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'
import { MidiMessageComponent } from './MidiMessageComponent'

export type MidiMessagesFieldComponentProps = {
  messages: Array<MidiMessage>
  onChange: (value: Array<MidiMessage>) => void
}

export const MidiMessagesFieldComponent: React.FC<
  MidiMessagesFieldComponentProps
> = ({ messages, onChange }) => {
  const messageUpdated = (message: MidiMessage) => {}
  return (
    <GroupedInputWithLabelComponent label='MIDI Messages'>
      {messages.map((message, i) => (
        <MidiMessageComponent
          label={`MIDI Message ${i + 1}`}
          key={i}
          value={message}
          onChange={messageUpdated}
        />
      ))}
    </GroupedInputWithLabelComponent>
  )
}
