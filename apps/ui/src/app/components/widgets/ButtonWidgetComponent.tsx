import React from 'react'
import { ButtonWidget } from '../../model/Widgets'
import { Box, Button, Typography } from '@mui/material'
import { Midi } from '../../midi/GlobalMidi'

export type ButtonWidgetComponentProps = {
  widget: ButtonWidget
}

export const ButtonWidgetComponent: React.FC<ButtonWidgetComponentProps> = ({ widget }) => {
  const dawEmitter = Midi.useDawEmitter()
  const onClick = () => {
    widget.midi.forEach(dawEmitter.send)
  }

  return (
    <Box sx={{}}>
      <Button
        sx={{
          height: 100,
          width: 100,
          backgroundColor: widget.color,
          textDecoration: 'none',
        }}
        variant='text'
        onClick={onClick}>
        <Typography
          sx={{
            fontWeight: 'bold',
            color: widget.textColor || 'black',
            fontSize: widget.fontSize,
          }}>
          {widget.content || ''}
        </Typography>
      </Button>
    </Box>
  )
}
