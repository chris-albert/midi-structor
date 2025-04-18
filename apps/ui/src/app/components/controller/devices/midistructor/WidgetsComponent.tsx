import React from 'react'
import { MidiEmitter, MIDIStructorUIWidgets } from '@midi-structor/core'
import { Box } from '@mui/material'
import _ from 'lodash'
import { WidgetComponent } from './WidgetComponent'
import { OnClick } from './MidiStructorComponent'

export type WidgetsComponentProps = {
  widgets: MIDIStructorUIWidgets
  isEdit: boolean
  onClick: OnClick
}

export const WidgetsComponent: React.FC<WidgetsComponentProps> = ({ widgets, isEdit, onClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}>
      {_.map(widgets, (widget, i) => (
        <Box
          key={`${widget._tag}-${i}`}
          sx={
            {
              //   ...(widget.name === 'spacer' && widget.isLineBreaking
              //     ? {
              //       flexBasis: '100%',
              //       height: isEdit ? '80px' : '0',
              //     }
              //     : {}),
            }
          }>
          <WidgetComponent
            widget={widget}
            onClick={onClick}
          />
        </Box>
      ))}
    </Box>
  )
}
