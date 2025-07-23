import { Switch } from '@mui/material'
import React from 'react'
import _ from 'lodash'
import { GroupedInputWithLabelComponent } from './GroupedInputWithLabelComponent'

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
    <GroupedInputWithLabelComponent
      label={_.startCase(label)}
      formControlSx={{
        padding: '0 5px',
      }}>
      <Switch
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </GroupedInputWithLabelComponent>
  )
}
