import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { PadUIComponent } from './PadUIComponent'
import { Typography } from '@mui/material'
import { Color } from '../../../Color'
import { TimeSigWidget } from '../../../widgets/TimeSigWidget'

export const TimeSigWidgetComponent = MIDIStructorWidget.of({
  widget: TimeSigWidget,
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
          {pad.options?.label || '4/4'}
        </Typography>
      </PadUIComponent>
    )
  },
})
