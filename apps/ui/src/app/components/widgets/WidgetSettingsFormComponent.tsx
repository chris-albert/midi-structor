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
import { ColorFieldComponent } from './fields/ColorFieldComponent'
import { MidiTargetFieldComponent } from './fields/MidiTargetFieldComponent'

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
  const [form, setForm] = React.useState<Record<string, any>>(
    _.fromPairs(
      _.compact(
        _.map(JSON.parse(settings), (value, key) => {
          if (typeof value === 'string') {
            return [key, value]
          } else if (typeof value === 'object') {
            return [key, value]
          } else {
            return undefined
          }
        })
      )
    )
  )

  const updateFormField = (key: string, value: any) => {
    // console.log('updateFormField', key, value)
    // console.log('form', form)
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
    const schemaName = SchemaForm.getFormName(field.ast)
    // console.log('Field', key, SchemaForm.getFormName(field.ast), field)
    if (schemaName._tag === 'Some') {
      if (schemaName.value === 'Color') {
        return (
          <ColorFieldComponent
            key={key}
            value={form[key]}
            onChange={(value) => {
              updateFormField(key, value)
            }}
          />
        )
      } else if (schemaName.value === 'MidiTarget') {
        return (
          <MidiTargetFieldComponent
            key={key}
            target={form[key]}
            onChange={(target) => {
              updateFormField(key, target)
            }}
          />
        )
      } else {
        return <Box key={key}>not implemented yet</Box>
      }
    } else {
      return (
        <TextField
          disabled={key === '_tag'}
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
    }
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
