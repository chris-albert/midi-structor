import React from 'react'
import { TextSchema } from '@midi-structor/core'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'
import { Slider, TextField } from '@mui/material'
import { ColorFieldComponent } from './ColorFieldComponent'

export type TextFieldComponentProps = {
  value: TextSchema
  onChange: (value: TextSchema) => void
}

export const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  value,
  onChange,
}) => {
  return (
    <GroupedInputWithLabelComponent label='Text'>
      <TextField
        fullWidth
        label='Content'
        variant='outlined'
        size='small'
        value={value?.content}
        onChange={(e) => {
          onChange({ ...value, content: e.target.value })
        }}
      />
      <ColorFieldComponent
        label='Color'
        value={(value?.color as string | undefined) || 'ffffff'}
        onChange={(color) => {
          //@ts-ignore
          onChange({ ...value, color })
        }}
      />
      <GroupedInputWithLabelComponent label='Size (px)'>
        <Slider
          sx={{
            py: 0,
            zIndex: 5,
          }}
          size='small'
          value={value?.sizePx !== undefined ? value?.sizePx : 2}
          min={10}
          max={100}
          valueLabelDisplay='auto'
          onChange={(e, sizePx) => {
            if (typeof sizePx === 'number') {
              onChange({ ...value, sizePx } as TextSchema)
            }
          }}
        />
      </GroupedInputWithLabelComponent>
    </GroupedInputWithLabelComponent>
  )
}
