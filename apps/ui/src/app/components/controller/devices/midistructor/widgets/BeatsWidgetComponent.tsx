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
            height: 100,
            width: 100,
            backgroundColor: `#${Color.toHex(pad.color)}`,
          }}>
          <Typography
            variant='h1'
            align='center'>
            {i + 1}
          </Typography>
        </Box>
      ))}
    </PadUIComponent>
  )
}
