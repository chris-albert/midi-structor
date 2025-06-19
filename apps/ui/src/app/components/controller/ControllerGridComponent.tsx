import React from 'react'
import { Box } from '@mui/material'
import { ControllerPad, ControllerUI } from './ControllerUI'
import {
  Color,
  ConfiguredController,
  ControllerUIDevice,
  MidiTarget,
} from '@midi-structor/core'
import { LaunchPadMiniMessage } from './devices/LaunchPadMiniMk3UI'

type PadWithState = {
  pad: ControllerPad
  color: number
}

type ControllerGridComponentProps = {
  controllerUI: ControllerUI
  controller: ConfiguredController
  device: ControllerUIDevice<LaunchPadMiniMessage, any>
}

const getColor = (message: LaunchPadMiniMessage | undefined): Color =>
  message !== undefined && message.type === 'color' ? message.color : 0

export const ControllerGridComponent: React.FC<
  ControllerGridComponentProps
> = ({ controllerUI, controller, device }) => {
  const buttonSize = 75
  const padStore = device.useStore(controller.name).useGet()
  const listener = ConfiguredController.useVirtualListener(controller)

  const pads: Array<Array<PadWithState>> = React.useMemo(() => {
    return controllerUI.pads.map((padRow, ri) =>
      padRow.map((pad, ci) => ({
        pad,
        color: getColor(padStore[MidiTarget.toKey(pad.target)]),
      }))
    )
  }, [padStore, controllerUI.pads])

  const onClick = (pad: ControllerPad) => {
    listener.emit(MidiTarget.toMessage(pad.target, 127))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
      }}>
      {pads.map((padRow, ri) => (
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
                backgroundColor: `#${Color.toHex(pad.color)}`,
                border: '1px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => onClick(pad.pad)}
              key={ci}>
              {pad.pad.content}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
