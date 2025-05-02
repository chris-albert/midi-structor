import React from 'react'
import { PadUIComponent } from './PadUIComponent'
import { Box, Typography } from '@mui/material'
import _ from 'lodash'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { BeatsWidget } from '../../../widgets/BeatsWidget'
import { Color } from '../../../Color'

export const BeatsWidgetComponent = MIDIStructorWidget.of({
  widget: BeatsWidget,
  Component: (widget, onClick, pads) => {
    const totalBeats = _.head(pads)?.options?.timeSignature.noteCount || 8
    return (
      <PadUIComponent>
        {pads.slice(0, totalBeats).map((pad, i) => (
          <Box
            key={i}
            sx={{
              borderRadius: '5px',
              border: '1px solid black',
              width: 100,
              backgroundColor: `#${
                pad.color === Color.BLACK ? '777777' : Color.toHex(pad.color)
              }`,
              display: 'flex',
            }}>
            <Typography
              sx={{
                width: '100%',
              }}
              variant='h1'
              lineHeight={1}
              align='center'>
              {i + 1}
            </Typography>
          </Box>
        ))}
      </PadUIComponent>
    )
  },
})
