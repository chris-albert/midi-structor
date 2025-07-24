import {
  MIDIStructorUIWidget,
  MIDIStructorUIWidgets,
} from '@midi-structor/core'

import _ from 'lodash'

export type Widget = MIDIStructorUIWidget

export type Widgets = MIDIStructorUIWidgets

type WidgetsUpdate = (w: Widgets) => Widgets

export const replaceWidget =
  (origWidget: Widget, updatedWidget: Widget): WidgetsUpdate =>
  (w) =>
    w.map((ww) => (_.isEqual(ww, origWidget) ? updatedWidget : ww))

export const addWidget =
  (widget: Widget): WidgetsUpdate =>
  (w) =>
    [...w, widget]

export const removeWidget =
  (widget: Widget): WidgetsUpdate =>
  (w) =>
    w.filter((ww) => !_.isEqual(ww, widget))

export const duplicateWidget =
  (widget: Widget): WidgetsUpdate =>
  (w) =>
    w.flatMap((ww) => (_.isEqual(ww, widget) ? [ww, ww] : ww))

const findWidgetIndex = (widgets: Widgets, widget: Widget): number => {
  return widgets.findIndex((w) => _.isEqual(w, widget))
}

export const moveRightWidget =
  (widget: Widget): WidgetsUpdate =>
  (widgets) => {
    const widgetIndex = findWidgetIndex(widgets, widget)
    if (widgetIndex === widgets.length - 1) {
      return widgets
    } else {
      return [
        ...widgets.slice(0, widgetIndex),
        widgets[widgetIndex + 1] as any,
        widgets[widgetIndex] as any,
        ...widgets.slice(widgetIndex + 2),
      ]
    }
  }

export const moveLeftWidget =
  (widget: Widget): WidgetsUpdate =>
  (widgets) => {
    const widgetIndex = findWidgetIndex(widgets, widget)
    if (widgetIndex === 0) {
      return widgets
    } else {
      return [
        ...widgets.slice(0, widgetIndex - 1),
        widgets[widgetIndex] as any,
        widgets[widgetIndex - 1] as any,
        ...widgets.slice(widgetIndex + 1),
      ]
    }
  }
