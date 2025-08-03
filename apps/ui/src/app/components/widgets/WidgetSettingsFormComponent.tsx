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
import { SwitchFieldComponent } from './fields/SwitchFieldComponent'
import { BorderFieldComponent } from './fields/BorderFieldComponent'
import { MidiTargetsFieldComponent } from './fields/MidiTargetsFieldComponent'
import { TextFieldComponent } from './fields/TextFieldComponent'
import { MidiMessagesFieldComponent } from './fields/MidiMessagesFieldComponent'
import { KnobFieldComponent } from './fields/KnobFieldComponent'

const Components: Array<WidgetSettingsFormField> = [WidgetSettingsString]

const SORT_HIGH_KEYS = ['label', 'color', 'target', 'midi']
const SORT_LOW_KEYS = ['border', 'visible']

const sort = (
  fields: Record<string, Schema.Struct.Field>
): Array<[string, Schema.Struct.Field]> => {
  const keys: Set<string> = new Set(_.keys(fields))

  const sorted: Array<[string, Schema.Struct.Field]> = []

  SORT_HIGH_KEYS.forEach((key) => {
    keys.forEach((fieldKey) => {
      if (_.toLower(fieldKey).includes(key)) {
        if (fields[fieldKey] !== undefined && keys.has(fieldKey)) {
          sorted.push([fieldKey, fields[fieldKey]])
          keys.delete(fieldKey)
        }
      }
    })
  })

  const sortedLow: Array<[string, Schema.Struct.Field]> = []

  SORT_LOW_KEYS.forEach((key) => {
    keys.forEach((fieldKey) => {
      if (_.toLower(fieldKey).includes(key)) {
        if (fields[fieldKey] !== undefined && keys.has(fieldKey)) {
          sortedLow.push([fieldKey, fields[fieldKey]])
          keys.delete(fieldKey)
        }
      }
    })
  })

  keys.forEach((fieldKey) => {
    if (fields[fieldKey] !== undefined) {
      sorted.push([fieldKey, fields[fieldKey]])
    }
  })

  return sorted.concat(sortedLow)
}

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
          return [key, value]
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

  const sortedFields = sort(config.widget.schema.fields)

  const formFields = _.map(sortedFields, (item) => {
    const [key, field] = item
    const schemaName = SchemaForm.getFormName(field.ast)
    // console.log('SchemaName', key, schemaName, field)
    if (schemaName._tag === 'Some') {
      if (schemaName.value === 'Color') {
        return (
          <ColorFieldComponent
            key={key}
            label={key}
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
      } else if (schemaName.value === 'MidiTargets') {
        return (
          <MidiTargetsFieldComponent
            key={key}
            targets={form[key]}
            onChange={(target) => {
              updateFormField(key, target)
            }}
          />
        )
      } else if (schemaName.value === 'Border') {
        return (
          <BorderFieldComponent
            key={key}
            value={form[key]}
            onChange={(isChecked) => {
              updateFormField(key, isChecked)
            }}
          />
        )
      } else if (schemaName.value === 'Switch') {
        return (
          <SwitchFieldComponent
            key={key}
            label={key}
            value={form[key]}
            onChange={(isChecked) => {
              updateFormField(key, isChecked)
            }}
          />
        )
      } else if (schemaName.value === 'MidiMessage') {
        return (
          <MidiMessagesFieldComponent
            key={key}
            messages={form[key]}
            onChange={(isChecked) => {
              updateFormField(key, isChecked)
            }}
          />
        )
      } else if (schemaName.value === 'MidiKnob') {
        return (
          <KnobFieldComponent
            key={key}
            value={form[key]}
            onChange={(isChecked) => {
              updateFormField(key, isChecked)
            }}
          />
        )
      } else if (schemaName.value === 'Text') {
        return (
          <TextFieldComponent
            key={key}
            value={form[key]}
            onChange={(value) => {
              updateFormField(key, value)
            }}
          />
        )
      } else {
        return <Box key={key}>{key} not implemented yet</Box>
      }
    } else if (key !== '_tag') {
      return (
        <TextField
          key={key}
          fullWidth
          label={_.startCase(key)}
          variant='outlined'
          size='small'
          value={form[key]}
          onChange={(e) => {
            updateFormField(key, e.target.value)
          }}
        />
      )
    } else {
      return null
    }
  })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pb: 2,
      }}>
      {formFields}
    </Box>
  )
}
