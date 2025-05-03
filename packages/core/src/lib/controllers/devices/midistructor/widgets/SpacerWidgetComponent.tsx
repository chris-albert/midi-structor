import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { Box } from '@mui/material'
import { ControllerWidget } from '../../../ControllerWidget'
import { Schema } from 'effect'

export const SpacerWidgetComponent = MIDIStructorWidget.of({
  widget: ControllerWidget.of({
    name: 'spacer',
    schema: Schema.Struct({
      width: Schema.Number,
    }),
    targets: (w) => [],
    component: ({}) => <></>,
  }),
  Component: (widget) => {
    return (
      <Box
        sx={{
          width: `${widget.width}px`,
        }}
      />
    )
  },
})
