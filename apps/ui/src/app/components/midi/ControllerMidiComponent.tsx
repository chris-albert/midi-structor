import React from 'react'
import { Box, Card, CardContent, CardHeader, FormControlLabel, Switch } from '@mui/material'
import { SelectComponent, SelectItem } from '../SelectComponent'
import { ControllerBrowserModeComponent } from './ControllerBrowserModeComponent'
import { ControllerAgentModeComponent } from './ControllerAgentModeComponent'

type ControllerMode = 'browser' | 'agent'

const selectItems: Array<SelectItem<ControllerMode>> = [
  {
    label: 'Browser',
    value: 'browser',
  },
  {
    label: 'Agent',
    value: 'agent',
  },
]

export type ControllerMidiComponentProps = {}

export const ControllerMidiComponent: React.FC<ControllerMidiComponentProps> = ({}) => {
  const [mode, setMode] = React.useState<ControllerMode>('browser')

  return (
    <Box>
      <Card>
        <CardHeader
          sx={{ p: 1 }}
          title='Controller Setup'
          action={
            <Box sx={{ display: 'flex' }}>
              <SelectComponent
                items={selectItems}
                label='Controller Mode'
                activeLabel={mode === 'browser' ? 'Browser' : 'Agent'}
                onChange={(v) => {
                  if (v !== undefined) {
                    setMode(v)
                  }
                }}
              />
            </Box>
          }
        />
        <CardContent>
          {mode === 'browser' ? <ControllerBrowserModeComponent /> : <ControllerAgentModeComponent />}
        </CardContent>
      </Card>
    </Box>
  )
}
