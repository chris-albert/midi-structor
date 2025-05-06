import { produce, current } from 'immer'
import _ from 'lodash'
import { Schema } from 'effect'

export const Widget = Schema.Struct({})

export type Widget = Schema.Schema.Type<typeof Widget>

export const Widgets = Schema.Array(Widget)

export type Widgets = Schema.Schema.Type<typeof Widgets>

export const emptyWidgets: Widgets = []

export const replaceWidget = (
  origWidget: Widget,
  updatedWidget: Widget
): ((w: Widgets) => Widgets) => {
  return produce<Widgets>((widgets) => {
    const widgetIndex = current(widgets).indexOf(origWidget)
    widgets[widgetIndex] = updatedWidget
  })
}

export const addWidget = (widget: Widget): ((w: Widgets) => Widgets) => {
  return produce<Widgets>((widgets) => {
    widgets.push(widget)
  })
}

export const removeWidget = (widget: Widget): ((w: Widgets) => Widgets) => {
  return produce<Widgets>((widgets) => {
    widgets.splice(current(widgets).indexOf(widget), 1)
  })
}

export const duplicateWidget = (widget: Widget): ((w: Widgets) => Widgets) => {
  return produce<Widgets>((widgets) => {
    const widgetIndex = current(widgets).indexOf(widget)
    const newWidget = _.clone(widget)
    widgets.splice(widgetIndex + 1, 0, newWidget)
  })
}

export const moveRightWidget = (widget: Widget): ((w: Widgets) => Widgets) => {
  return produce<Widgets>((widgets) => {
    const widgetIndex = current(widgets).indexOf(widget)
    widgets.splice(widgetIndex, 1)
    widgets.splice(widgetIndex + 1, 0, widget)
  })
}

export const moveLeftWidget = (widget: Widget): ((w: Widgets) => Widgets) => {
  return produce<Widgets>((widgets) => {
    const widgetIndex = current(widgets).indexOf(widget)
    widgets.splice(widgetIndex, 1)
    widgets.splice(widgetIndex - 1, 0, widget)
  })
}
