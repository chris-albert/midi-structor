import React from 'react'
import { Box } from '@mui/material'
import { ControllerPad, ControllerUI } from './ControllerUI'

type ControllerGridComponentProps = {
  controller: ControllerUI
}

export const ControllerGridComponent: React.FC<ControllerGridComponentProps> = ({ controller }) => {
  const buttonSize = 75

  const onClick = (pad: ControllerPad) => {
    console.log('pad', pad)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
      }}>
      {controller.pads.map((padRow, ri) => (
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'row',
          }}
          key={ri}>
          {padRow.map((pad, ci) => (
            <Box
              sx={{
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
                border: '1px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => onClick(pad)}
              key={ci}>
              {pad.content}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
