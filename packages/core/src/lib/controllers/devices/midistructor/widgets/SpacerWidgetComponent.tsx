import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { Box } from '@mui/material'
import { ControllerWidget } from '../../../ControllerWidget'
import { Schema } from 'effect'
import { SchemaForm } from '../../../widgets/form/SchemaForm'

export const SpacerWidgetComponent = MIDIStructorWidget.of({
  widget: ControllerWidget.none({
    name: 'spacer',
    schema: Schema.Struct({
      width: Schema.Number,
      isLineBreaking: Schema.optional(Schema.Boolean).annotations(
        SchemaForm.annotation('Switch')
      ),
    }),
    init: () => ({
      width: 100,
    }),
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
