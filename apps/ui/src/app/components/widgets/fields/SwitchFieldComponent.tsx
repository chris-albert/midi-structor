import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import _ from 'lodash'

export type SwitchFieldComponentProps = {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}

export const SwitchFieldComponent: React.FC<SwitchFieldComponentProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
      }
      label={_.startCase(label)}
    />
  )
}
