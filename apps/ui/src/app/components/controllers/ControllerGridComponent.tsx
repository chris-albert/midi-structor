import React from 'react'
import { Box } from '@mui/material'
import { Controller, ControllerPad } from '../../model/controllers/Controller'
import { Midi } from '../../midi/GlobalMidi'

type ControllerGridComponentProps = {
  controller: Controller
}

export const ControllerGridComponent: React.FC<ControllerGridComponentProps> = ({ controller }) => {
  const buttonSize = 75
  const controllerEmitter = Midi.useControllerEmitter()

  const onClick = (pad: ControllerPad) => {
    controllerEmitter.send(pad.message(5))
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
