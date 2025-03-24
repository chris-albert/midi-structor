import React from 'react'
import { Controller } from './Controller'
import { ResolvedControllerWidget } from './ControllerWidget'

type ControllerWidgetComponentProps = {
  widget: ResolvedControllerWidget
}

const ControllerWidgetComponent: React.FC<ControllerWidgetComponentProps> = ({ widget }) => {
  return widget.component()
}

export type ControllerConfigComponentProps = {
  controller: Controller
  name: string
  widgets: Array<ResolvedControllerWidget>
}

export const ControllerConfigComponent: React.FC<ControllerConfigComponentProps> = ({
  controller,
  name,
  widgets,
}) => {
  return (
    <controller
      model={controller}
      name={name}>
      {widgets.map((widget, i) => (
        <ControllerWidgetComponent
          widget={widget}
          key={`${widget.name}-${i}`}
        />
      ))}
    </controller>
  )
}
