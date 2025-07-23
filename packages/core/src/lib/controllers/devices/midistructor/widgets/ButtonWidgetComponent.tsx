import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { ButtonWidget } from '../../../widgets/ButtonWidget'
import { PadUIComponent } from './PadUIComponent'
import { Button, Typography } from '@mui/material'
import { Color } from '../../../Color'

export const ButtonWidgetComponent = MIDIStructorWidget.of({
  widget: ButtonWidget,
  Component: (widget, onClick, pad) => {
    return (
      <PadUIComponent>
        <Button
          sx={{
            height: 100,
            width: 100,
            backgroundColor: `#${Color.toHex(widget.color)}`,
            textDecoration: 'none',
          }}
          onClick={() => onClick(pad.target)}
          variant='text'>
          <Typography
            sx={{
              fontWeight: 'bold',
              color: `#${Color.toHex(widget.text?.color || Color.BLACK)}`,
              ...(widget.text?.sizePx !== undefined
                ? { fontSize: `${widget.text?.sizePx}px` }
                : {}),
            }}>
            {widget.text?.content || ''}
          </Typography>
        </Button>
      </PadUIComponent>
    )
  },
})
