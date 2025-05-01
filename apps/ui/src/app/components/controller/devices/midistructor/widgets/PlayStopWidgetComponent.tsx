import React from 'react'
import { PlayStopWidget } from '@midi-structor/core'
import { PlayButtonComponent } from '../../../../PlayButtonComponent'
import { StopButtonComponent } from '../../../../StopButtonComponent'
import { PadUIComponent } from './PadUIComponent'
import { MIDIStructorWidget } from '../MIDIStructorWidget'

export const PlayStopWidgetComponent = MIDIStructorWidget.of({
  widget: PlayStopWidget,
  Component: (widget, onClick, pad) => {
    return (
      <PadUIComponent>
        {pad.color === widget.playColor ? (
          <PlayButtonComponent onPlay={() => onClick(widget.target)} />
        ) : (
          <StopButtonComponent onStop={() => onClick(widget.target)} />
        )}
      </PadUIComponent>
    )
  },
})
