import React from 'react'
import { MuiColorInput } from 'mui-color-input'
import _ from 'lodash'

export type ColorFieldComponentProps = {
  label: string
  value: string | undefined
  onChange: (v: string) => void
}

export const ColorFieldComponent: React.FC<ColorFieldComponentProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <MuiColorInput
      label={_.startCase(label)}
      size='small'
      format='hex'
      value={value || ''}
      onChange={(value: string) => {
        onChange(value.substring(1))
      }}
    />
  )
}
