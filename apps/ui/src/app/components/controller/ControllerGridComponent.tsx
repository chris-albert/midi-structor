import React from 'react'
import { Box } from '@mui/material'
import { ControllerPad, ControllerUI } from './ControllerUI'
import { Color, ConfiguredController, MidiTarget, UIMessageStore } from '@midi-structor/core'
import { LaunchPadMiniMessage } from './devices/LaunchPadMiniMk3UI'

type PadWithState = {
  pad: ControllerPad
  color: number
}

type ControllerGridComponentProps = {
  controllerUI: ControllerUI
  controller: ConfiguredController
}

const getColor = (message: LaunchPadMiniMessage | undefined): Color =>
  message !== undefined && message.type === 'color' ? message.color : 0

export const ControllerGridComponent: React.FC<ControllerGridComponentProps> = ({
  controllerUI,
  controller,
}) => {
  const buttonSize = 75
  // TODO: This casting here is dumb, need to guarantee this is correct
  const padStore = ConfiguredController.useVirtualStore(controller) as UIMessageStore<LaunchPadMiniMessage>
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
    const message = MidiTarget.toMessage(pad.target, 127)
    listener.emit({ raw: [] as any, time: new Date(), ...message })
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
