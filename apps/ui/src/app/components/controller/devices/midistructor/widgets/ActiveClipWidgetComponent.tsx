import React from 'react'
import {
  ActiveClipWidget,
  Color,
  ControllerWidgetType,
  MIDIStructorPad,
} from '@midi-structor/core'
import { OnClick } from '../MidiStructorComponent'
import { PadUIComponent } from './PadUIComponent'
import { Typography } from '@mui/material'

export type ActiveClipWidgetComponentProps = {
  widget: ControllerWidgetType<typeof ActiveClipWidget>
  onClick: OnClick
  pad: MIDIStructorPad
}

export const ActiveClipWidgetComponent: React.FC<
  ActiveClipWidgetComponentProps
> = ({ widget, onClick, pad }) => {
  return (
    <PadUIComponent>
      <Typography
        sx={{
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
}
