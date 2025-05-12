import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { PadUIComponent } from './PadUIComponent'
import { MetronomeControlWidget } from '../../../widgets/MetronomeControlWidget'
import IconButton from '@mui/material/IconButton'
import { Box } from '@mui/material'
import { Color } from '../../../Color'
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit'

export const MetronomeControlWidgetComponent = MIDIStructorWidget.of({
  widget: MetronomeControlWidget,
  Component: (widget, onClick, pad) => {
    const metronomeState =
      pad.options.metronomeState !== undefined
        ? pad.options.metronomeState
        : false
    const color = metronomeState ? widget.color : Color.BLACK
    return (
      <PadUIComponent>
        <Box
          sx={{
            borderRadius: '5px',
            backgroundColor: `#${Color.toHex(color)}`,
          }}>
          <IconButton
            sx={{
              width: 100,
              height: 100,
            }}
            aria-label='metro-control'
            onClick={() => onClick(pad.target)}>
            <DirectionsTransitIcon sx={{ fontSize: 80 }} />
          </IconButton>
        </Box>
      </PadUIComponent>
    )
  },
})
