import React from 'react'
import { MidiMessage } from '@midi-structor/core'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'
import { MidiMessageComponent } from './MidiMessageComponent'
import { Box, Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import _ from 'lodash'

export type MidiMessagesFieldComponentProps = {
  messages: Array<MidiMessage>
  onChange: (value: Array<MidiMessage>) => void
}

export const MidiMessagesFieldComponent: React.FC<
  MidiMessagesFieldComponentProps
> = ({ messages, onChange }) => {
  const messageUpdated = (newMessage: MidiMessage, index: number) =>
    onChange(_.map(messages, (m, i) => (i === index ? newMessage : m)))

  const onAdd = () => {
    onChange([
      ...messages,
      {
        type: 'cc',
        controllerNumber: 1,
        data: 127,
        channel: 1,
      },
    ])
  }

  const onRemove = (index: number) => {
    onChange(_.filter(messages, (m, messageIndex) => messageIndex !== index))
  }

  return (
    <GroupedInputWithLabelComponent label='MIDI Messages'>
      {messages.map((message, i) => (
        <MidiMessageComponent
          label={`MIDI Message ${i + 1}`}
          key={i}
          value={message}
          onChange={(m) => messageUpdated(m, i)}
          onRemove={() => {
            onRemove(i)
          }}
        />
      ))}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}>
        <Button
          size='small'
          startIcon={<AddCircleIcon />}
          color='success'
          onClick={onAdd}
          variant='contained'>
          Add
        </Button>
      </Box>
    </GroupedInputWithLabelComponent>
  )
}
