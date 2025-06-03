import React from 'react'
import { TextField } from '@mui/material'
import { WidgetSettingsFormField } from './WidgetSettingsFormField'

export const WidgetSettingsString: WidgetSettingsFormField = {
  schemaForm: 'String',
  Component: ({ name, value, onChange }) => {
    return (
      <TextField
        fullWidth
        label={name}
        variant='outlined'
        size='small'
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    )
  },
}
