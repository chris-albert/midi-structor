import React from 'react'
import {
  MIDIStructorUIWidget,
  MIDIStructorWidget,
  SchemaForm,
} from '@midi-structor/core'
import { Box, TextField } from '@mui/material'
import { Schema } from 'effect'
import _ from 'lodash'
import { WidgetSettingsFormField } from './WidgetSettingsFormField'
import { WidgetSettingsString } from './WidgetSettingsString'

const Components: Array<WidgetSettingsFormField> = [WidgetSettingsString]

export type WidgetSettingsFormComponentProps = {
  widget: MIDIStructorUIWidget
  config: MIDIStructorWidget<any, Schema.Struct.Fields>
  settings: string
  setSettings: (f: (s: string) => string) => void
}

export const WidgetSettingsFormComponent: React.FC<
  WidgetSettingsFormComponentProps
> = ({ widget, config, settings, setSettings }) => {
  const [form, setForm] = React.useState<Record<string, string>>(
    _.fromPairs(
      _.compact(
        _.map(JSON.parse(settings), (value, key) => {
          if (typeof value === 'string') {
            return [key, value.toString()]
          } else if (typeof value === 'object') {
            return [key, JSON.stringify(value)]
          } else {
            return undefined
          }
        })
      )
    )
  )

  const updateFormField = (key: string, value: string) => {
    console.log('updateFormField', key, value)
    setForm((form) => {
      const newForm = { ...form, [key]: value }
      setSettings((_) => JSON.stringify(newForm, null, 2))
      return newForm
    })
  }

  // console.log('form', form)
  // console.log('config', config)
  // const formFields = null
  const formFields = _.map(config.widget.schema.fields, (field, key) => {
    // console.log('Field', key, SchemaForm.getFormName(field.ast), field)

    return (
      <TextField
        key={key}
        fullWidth
        label={key}
        variant='outlined'
        size='small'
        value={form[key]}
        onChange={(e) => {
          updateFormField(key, e.target.value)
        }}
      />
    )
  })
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
      {formFields}
    </Box>
  )
}
