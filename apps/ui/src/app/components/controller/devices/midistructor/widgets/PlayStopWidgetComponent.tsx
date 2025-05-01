import React from 'react'
import {
  ControllerWidgetType,
  MIDIStructorPad,
  PlayStopWidget,
} from '@midi-structor/core'
import { PlayButtonComponent } from '../../../../PlayButtonComponent'
import { OnClick } from '../MidiStructorComponent'
import { StopButtonComponent } from '../../../../StopButtonComponent'
import { PadUIComponent } from './PadUIComponent'
import { MIDIStructorWidget } from '../MIDIStructorWidget'

export type PlayStopWidgetComponentProps = {
  widget: ControllerWidgetType<typeof PlayStopWidget>
  onClick: OnClick
  pad: MIDIStructorPad
}

export const PlayStopWidgetComponent: React.FC<
  PlayStopWidgetComponentProps
> = ({ widget, onClick, pad }) => {
  return (
    <PadUIComponent>
      {pad.color === widget.playColor ? (
        <PlayButtonComponent onPlay={() => onClick(widget.target)} />
      ) : (
        <StopButtonComponent onStop={() => onClick(widget.target)} />
      )}
    </PadUIComponent>
  )
}

// export const PlayStopWidgetComponent = MIDIStructorWidget.of({
//   widget: PlayStopWidget,
//   Component: (widget, onClick, pad) => {
//     return (
//       <PadUIComponent>
//         {pad.color === widget.playColor ? (
//           <PlayButtonComponent onPlay={() => onClick(widget.target)} />
//         ) : (
//           <StopButtonComponent onStop={() => onClick(widget.target)} />
//         )}
//       </PadUIComponent>
//     )
//   },
// })
