import React from 'react'
import { PadUIComponent } from './PadUIComponent'
import { Typography } from '@mui/material'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { ActiveClipWidget } from '../../../widgets/ActiveClipWidget'
import { Color } from '../../../Color'

export const ActiveClipWidgetComponent = MIDIStructorWidget.of({
  widget: ActiveClipWidget,
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
          {pad.options?.label || ''}
        </Typography>
      </PadUIComponent>
    )
  },
})
