import React from 'react'
import { ControllerWidgetType, PlayStopWidget } from '@midi-structor/core'
import { PlayButtonComponent } from '../../../../PlayButtonComponent'
import { OnClick } from '../MidiStructorComponent'

export type PlayStopWidgetComponentProps = {
  widget: ControllerWidgetType<typeof PlayStopWidget>
  onClick: OnClick
}

export const PlayStopWidgetComponent: React.FC<PlayStopWidgetComponentProps> = ({ widget, onClick }) => {
  return <PlayButtonComponent onPlay={() => onClick(widget.target)} />
}
