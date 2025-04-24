import React from 'react'
import {
  BeatsWidget,
  Color,
  ControllerWidgetType,
  MIDIStructorPad,
} from '@midi-structor/core'
import { PadUIComponent } from './PadUIComponent'
import { Box, Typography } from '@mui/material'

export type BeatsWidgetComponentProps = {
  widget: ControllerWidgetType<typeof BeatsWidget>
  pads: Array<MIDIStructorPad>
}

export const BeatsWidgetComponent: React.FC<BeatsWidgetComponentProps> = ({
  widget,
  pads,
}) => {
  return (
    <PadUIComponent>
      {pads.map((pad, i) => (
        <Box
          key={i}
          sx={{
            border: '1px solid black',
            width: 100,
            backgroundColor: `#${Color.toHex(pad.color)}`,
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
}
