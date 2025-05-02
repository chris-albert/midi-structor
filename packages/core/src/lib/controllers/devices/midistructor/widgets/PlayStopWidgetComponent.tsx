import React from 'react'
import { PadUIComponent } from './PadUIComponent'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { PlayStopWidget } from '../../../widgets/PlayStopWidget'
import { PlayButtonComponent } from './PlayButtonComponent'
import { StopButtonComponent } from './StopButtonComponent'

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
