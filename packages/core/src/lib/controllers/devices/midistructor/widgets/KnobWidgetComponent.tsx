import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { PadUIComponent } from './PadUIComponent'
import { Box, Button, Typography } from '@mui/material'
import { Color } from '../../../Color'
import { KnobWidget } from '../../../widgets/KnobWidget'
import { Knob } from 'primereact/knob'

export const KnobWidgetComponent = MIDIStructorWidget.of({
  widget: KnobWidget,
  Component: (widget, onClick, pad) => {
    const [value, setValue] = React.useState(0)

    const onChangeValue = (value: number) => {
      setValue(value)
    }

    return (
      <PadUIComponent>
        <Box
          sx={{
            height: 100,
            width: 100,
            backgroundColor: `#${Color.toHex(widget.color)}`,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {widget.text?.content || ''}
            </Typography>
          </Box>
          <Box sx={{ p: 0, mt: 1 }}>
            <Knob
              value={value}
              onChange={(e) => onChangeValue(e.value)}
              min={0}
              max={127}
            />
          </Box>
        </Box>
      </PadUIComponent>
    )
  },
})
