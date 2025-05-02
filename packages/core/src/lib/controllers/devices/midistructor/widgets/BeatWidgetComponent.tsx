import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { PadUIComponent } from './PadUIComponent'
import { Typography } from '@mui/material'
import { Color } from '../../../Color'
import { BeatWidget } from '../../../widgets/BeatWidget'

export const BeatWidgetComponent = MIDIStructorWidget.of({
  widget: BeatWidget,
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
