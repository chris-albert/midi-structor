import React from 'react'
import {
  AllMidiStructorWidgets,
  MIDIStructorStore,
  MIDIStructorUIWidget,
  OnClick,
} from '@midi-structor/core'
import { Box } from '@mui/material'

const getLabel = (widget: MIDIStructorUIWidget): React.ReactElement | null =>
  widget.label === undefined ? null : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Box
        sx={{
          position: 'absolute',
          x: 0,
          y: '0',
          marginTop: '-16px',
          backgroundColor: '#777777',
          border: '1px solid white',
          lineHeight: 1,
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          paddingLeft: '3px',
          paddingRight: '3px',
        }}>
        {widget.label}
      </Box>
    </Box>
  )

export type WidgetComponentProps = {
  widget: MIDIStructorUIWidget
  onClick: OnClick
  store: MIDIStructorStore
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  onClick,
  store,
}) => {
  const el = AllMidiStructorWidgets.Component(widget, onClick, store)
  const label = getLabel(widget)
  const widgetBody = (
    <Box
      sx={{
        p: 2,
        borderSize: `${widget.border?.sizePx || 1}px`,
        borderColor: widget.border?.color || 'white',
        borderStyle: 'solid',
        borderRadius: '5px',
      }}>
      {label}
      <Box>{el}</Box>
    </Box>
  )
  return <Box>{widgetBody}</Box>
}
