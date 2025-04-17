import React from 'react'
import { ResolvedControllerWidget } from '@midi-structor/core'
import { Box } from '@mui/material'
import _ from 'lodash'
import { WidgetComponent } from './WidgetComponent'

export type WidgetsComponentProps = {
  widgets: Array<ResolvedControllerWidget>
  isEdit: boolean
}

export const WidgetsComponent: React.FC<WidgetsComponentProps> = ({ widgets, isEdit }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}>
      {_.map(widgets, (widget, i) => (
        <Box
          key={`${widget.name}-${i}`}
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
          <WidgetComponent widget={widget} />
        </Box>
      ))}
    </Box>
  )
}
