import React from 'react'
import { Box } from '@mui/material'
import _ from 'lodash'
import { WidgetComponent } from './WidgetComponent'
import { editWidgetsAtom } from '../model/Widgets'
import { useAtomValue } from 'jotai'
import objectHash from 'fast-json-stable-stringify'
import { ProjectHooks } from '../hooks/ProjectHooks'

export type WidgetsComponentProps = {}

export const WidgetsComponent: React.FC<WidgetsComponentProps> = ({}) => {
  const [widgets] = ProjectHooks.useWidgets()
  const isEdit = useAtomValue(editWidgetsAtom)

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}>
      {_.map(widgets, (widget, i) => (
        <Box
          key={`${objectHash(widget)}-${i}`}
          sx={{
            ...(widget.type === 'spacer' && widget.isLineBreaking
              ? {
                  flexBasis: '100%',
                  height: isEdit ? '80px' : '0',
                }
              : {}),
          }}>
          <WidgetComponent widget={widget} />
        </Box>
      ))}
    </Box>
  )
}
