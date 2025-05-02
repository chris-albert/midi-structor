import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { PadUIComponent } from './PadUIComponent'
import { Box, Typography } from '@mui/material'
import { Color } from '../../../Color'
import { NavClipsWidget } from '../../../widgets/NavClipsWidget'

export const NavClipsWidgetComponent = MIDIStructorWidget.of({
  widget: NavClipsWidget,
  Component: (widget, onClick, pads) => {
    return (
      <PadUIComponent>
        {pads.map((pad, i) =>
          pad.options !== undefined ? (
            <Box
              key={i}
              sx={{
                borderRadius: '5px',
                border: '1px solid black',
                backgroundColor: `#${Color.toHex(pad.color)}`,
                display: 'flex',
                width: 100,
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => onClick(pad.target)}>
              <Typography
                sx={{
                  width: '100%',
                  px: 1,
                }}
                lineHeight={1}
                align='center'>
                {pad.options?.label || ''}
              </Typography>
            </Box>
          ) : null
        )}
      </PadUIComponent>
    )
  },
})
