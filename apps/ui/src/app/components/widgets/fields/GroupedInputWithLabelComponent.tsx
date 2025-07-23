import React from 'react'
import { FormControl, InputLabel } from '@mui/material'
import { SxProps } from '@mui/system'

export type GroupedInputWithLabelComponentProps = {
  label: string
  children?: React.ReactNode
  formControlSx?: SxProps
}

export const GroupedInputWithLabelComponent: React.FC<
  GroupedInputWithLabelComponentProps
> = ({ label, children, formControlSx }) => {
  return (
    <FormControl
      variant='outlined'
      sx={{
        position: 'relative',
        border: '1px solid rgb(82, 82, 82)',
        borderRadius: 1,
        padding: '18.5px 14px 14.5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        ...formControlSx,
      }}>
      <InputLabel
        sx={{
          position: 'absolute',
          top: -25,
          left: -7,
          px: 0.5,
          fontSize: '0.75rem',
          backgroundColor: 'rgba(30,30,30)',
          pointerEvents: 'none',
          zIndex: 1,
          boxShadow: '0 0 0 8px transparent',
        }}>
        {label}
      </InputLabel>

      {children}
    </FormControl>
  )
}
