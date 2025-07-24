import React from 'react'
import {
  MIDIStructorStore,
  MIDIStructorUIWidgets,
  MIDIStructorUIWidgetsUpdate,
  OnClick,
} from '@midi-structor/core'
import { Box } from '@mui/material'
import _ from 'lodash'
import { WidgetComponent } from './WidgetComponent'

export type WidgetsComponentProps = {
  widgets: MIDIStructorUIWidgets
  isEdit: boolean
  onClick: OnClick
  store: MIDIStructorStore
  updateWidgets: MIDIStructorUIWidgetsUpdate
}

export const WidgetsComponent: React.FC<WidgetsComponentProps> = ({
  widgets,
  isEdit,
  onClick,
  store,
  updateWidgets,
}) => {
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
          sx={{
            ...(widget._tag === 'spacer' && widget.isLineBreaking
              ? {
                  flexBasis: '100%',
                  height: isEdit ? '32px' : '0',
                  // height: 0,
                }
              : {}),
          }}>
          <WidgetComponent
            widget={widget}
            onClick={onClick}
            store={store}
            isEdit={isEdit}
            updateWidgets={updateWidgets}
            widgetIndex={i}
          />
        </Box>
      ))}
    </Box>
  )
}
