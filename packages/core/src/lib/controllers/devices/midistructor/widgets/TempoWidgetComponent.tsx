import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { PadUIComponent } from './PadUIComponent'
import { TempoWidget } from '../../../widgets/TempoWidget'
import { Color } from '../../../Color'
import { Typography } from '@mui/material'

export const TempoWidgetComponent = MIDIStructorWidget.of({
  widget: TempoWidget,
  Component: (widget, onClick, pad) => {
    return (
      <PadUIComponent>
        <Typography
          sx={{
            borderRadius: '5px',
            width: '100%',
            backgroundColor: `#${Color.toHex(pad.color)}`,
          }}
          variant='h1'
          lineHeight={1}
          align='center'>
          {pad.options?.label || '0'}
        </Typography>
      </PadUIComponent>
    )
  },
})
