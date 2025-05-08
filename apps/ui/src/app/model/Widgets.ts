import {
  MIDIStructorUIWidget,
  MIDIStructorUIWidgets,
  MIDIStructorUIWidgetsUpdate,
} from '@midi-structor/core'

export type Widget = MIDIStructorUIWidget

export type Widgets = MIDIStructorUIWidgets

type WidgetsUpdate = (w: Widgets) => Widgets

export const replaceWidget =
  (origWidget: Widget, updatedWidget: Widget): WidgetsUpdate =>
  (w) =>
    w.filter((ww) => (ww === origWidget ? updatedWidget : ww))

export const addWidget =
  (widget: Widget): WidgetsUpdate =>
  (w) =>
    [...w, widget]

export const removeWidget =
  (widget: Widget): WidgetsUpdate =>
  (w) =>
    w.filter((ww) => ww !== widget)

export const duplicateWidget =
  (widget: Widget): WidgetsUpdate =>
  (w) =>
    w.flatMap((ww) => (ww === widget ? [ww, ww] : ww))

export const moveRightWidget =
  (widget: Widget): WidgetsUpdate =>
  (widgets) => {
    const widgetIndex = widgets.indexOf(widget)
    return [
      ...widgets.slice(0, widgetIndex),
      widgets[widgetIndex + 1] as any,
      widgets[widgetIndex] as any,
      ...widgets.slice(widgetIndex + 2),
    ]
  }

export const moveLeftWidget =
  (widget: Widget): WidgetsUpdate =>
  (widgets) => {
    const widgetIndex = widgets.indexOf(widget)
    return [
      ...widgets.slice(0, widgetIndex - 1),
      widgets[widgetIndex] as any,
      widgets[widgetIndex - 1] as any,
      ...widgets.slice(widgetIndex + 1),
    ]
  }
