import React from 'react'
import { ResolvedControllerWidget } from '@midi-structor/core'

export type WidgetComponentProps = {
  widget: ResolvedControllerWidget
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({ widget }) => {
  console.log('widget', widget)
  return <>{widget.name}</>
}
