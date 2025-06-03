import React from 'react'

export type WidgetSettingsFormFieldProps = {
  name: string
  value: string
  onChange: (value: string) => void
}

export type WidgetSettingsFormField = {
  schemaForm: string
  Component: (props: WidgetSettingsFormFieldProps) => React.ReactElement
}
