import _ from 'lodash'
import { ControllerWidget, ResolvedControllerWidget } from './ControllerWidget'
import { ControllerConfig } from './ControllerConfig'
import { Option, Schema } from 'effect'

export type ControllerWidgets<Widgets extends Array<ControllerWidget>> = {
  schema: Schema.Schema<any>
  resolve: (c: ControllerConfig) => Array<ResolvedControllerWidget>
  getByName: (n: string) => Option.Option<ControllerWidget<any>>
  widgets: Widgets
}

export const ControllerWidgets = <Widgets extends Array<ControllerWidget>>(
  widgets: Widgets
): ControllerWidgets<Widgets> => {
  const lookup = _.fromPairs(_.map(widgets, (widget) => [widget.name, widget]))
  const schema: Schema.Schema<any> = Schema.Union(
    ...widgets.map((w) => w.schema as any as Schema.Schema<any>)
  )

  const resolve = (
    config: ControllerConfig
  ): Array<ResolvedControllerWidget> => {
    return config.widgets.flatMap((w: any) => {
      return Option.match(getByName(w._tag), {
        onSome: (controllerWidget) => {
          return {
            name: controllerWidget.name,
            targets: () => controllerWidget.targets(w),
            component: () => controllerWidget.component(w),
            widget: w,
          } as ResolvedControllerWidget
        },
        onNone: () => {
          console.error('No widget found for config', w)
          return []
        },
      })
    })
  }

  const getByName = (name: string): Option.Option<ControllerWidget<any>> =>
    Option.fromNullable(_.get(lookup, name, undefined))

  return {
    schema,
    resolve,
    getByName,
    widgets,
  }
}
