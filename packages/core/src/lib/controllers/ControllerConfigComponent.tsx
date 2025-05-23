import React from 'react'
import { Controller } from './Controller'
import { ResolvedControllerWidget } from './ControllerWidget'
import { ProjectHooks } from '../project/ProjectHooks'
import { ControllerInstance } from './ControllerInstance'

type ControllerWidgetComponentProps = {
  widget: ResolvedControllerWidget
}

const ControllerWidgetComponent: React.FC<ControllerWidgetComponentProps> = ({
  widget,
}) => {
  return widget.component()
}

export type ControllerConfigComponentProps = {
  controller: ControllerInstance
  name: string
  widgets: Array<ResolvedControllerWidget>
}

export const ControllerConfigComponent: React.FC<
  ControllerConfigComponentProps
> = ({ controller, name, widgets }) => {
  React.useEffect(() => {
    controller.init(widgets)
  }, [widgets])

  const loading = ProjectHooks.useIsProjectLoading()

  if (loading) {
    return null
  } else {
    controller.loaded()
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
}
