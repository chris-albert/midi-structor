import React from 'react'
import { Box, Typography } from '@mui/material'
import { KnobWidget } from '../../model/Widgets'
import { Knob } from 'primereact/knob'
import { Midi } from '../../midi/GlobalMidi'

export type KnobWidgetComponentProps = {
  widget: KnobWidget
}

export const KnobWidgetComponent: React.FC<KnobWidgetComponentProps> = ({ widget }) => {
  const dawEmitter = Midi.useDawEmitter()
  const [value, setValue] = React.useState(0)

  const onChangeValue = (value: number) => {
    setValue(value)
    if (widget.midi !== undefined && widget.midi.type === 'midi-note-velocity') {
      dawEmitter.send({
        type: 'noteon',
        channel: widget.midi.channel,
        note: widget.midi.note,
        velocity: value,
      })
    }
  }

  return (
    <Box
      sx={{
        height: 100,
        width: 100,
        backgroundColor: widget.color,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Typography sx={{ fontWeight: 'bold' }}>{widget.content || ''}</Typography>
      </Box>
      <Box sx={{ p: 0, mt: 1 }}>
        <Knob
          value={value}
          onChange={(e) => onChangeValue(e.value)}
          min={0}
          max={127}
        />
      </Box>
    </Box>
  )
}
