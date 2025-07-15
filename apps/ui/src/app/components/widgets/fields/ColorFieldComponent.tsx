import React from 'react'
import { MuiColorInput } from 'mui-color-input'

export type ColorFieldComponentProps = {
  value: string | undefined
  onChange: (v: string) => void
}

export const ColorFieldComponent: React.FC<ColorFieldComponentProps> = ({
  value,
  onChange,
}) => {
  return (
    <MuiColorInput
      label='Color'
      size='small'
      format='hex'
      value={value || ''}
      onChange={(value: string) => {
        onChange(value.substring(1))
      }}
    />
  )
}
