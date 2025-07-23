import React from 'react'
import { Schema } from 'effect'
import { SchemaForm } from '@midi-structor/core'
import { Box, Slider, Typography } from '@mui/material'
import { ColorFieldComponent } from './ColorFieldComponent'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'

export type BorderFieldComponentProps = {
  value: Schema.Schema.Type<typeof SchemaForm.Schemas.Border>
  onChange: (v: Schema.Schema.Type<typeof SchemaForm.Schemas.Border>) => void
}

export const BorderFieldComponent: React.FC<BorderFieldComponentProps> = ({
  value,
  onChange,
}) => {
  return (
    <GroupedInputWithLabelComponent label='Border'>
      <GroupedInputWithLabelComponent label='Size (px)'>
        <Slider
          sx={{
            py: 0,
            zIndex: 5,
          }}
          size='small'
          value={value?.sizePx !== undefined ? value?.sizePx : 2}
          min={0}
          max={10}
          valueLabelDisplay='auto'
          onChange={(e, sizePx) => {
            if (typeof sizePx === 'number') {
              onChange({ ...value, sizePx })
            }
          }}
        />
      </GroupedInputWithLabelComponent>
      <ColorFieldComponent
        label='Color'
        value={value?.color || 'ffffff'}
        onChange={(color) => {
          onChange({ ...value, color })
        }}
      />
    </GroupedInputWithLabelComponent>
  )
}
