import React from 'react'
import {
  ControllerWidget,
  ControllerWidgetType,
  MIDIStructorPad,
} from '@midi-structor/core'
import { OnClick } from './MidiStructorComponent'
import { Schema, SchemaAST } from 'effect'

const UIBaseSchema = Schema.Struct({
  label: Schema.optional(Schema.String),
  border: Schema.optional(
    Schema.Struct({
      sizePx: Schema.optional(Schema.Number),
      color: Schema.optional(Schema.String),
    })
  ),
  visible: Schema.optional(Schema.Boolean),
})

export type MIDIStructorWidget<
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields
> = {
  widget: ControllerWidget<K, A & typeof UIBaseSchema.fields>
  Component: (
    widget: ControllerWidgetType<ControllerWidget<K, A>>,
    onClick: OnClick,
    pad: MIDIStructorPad
  ) => React.ReactElement
}

const of = <
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields
>(opts: {
  widget: ControllerWidget<K, A>
  Component: (
    widget: ControllerWidgetType<ControllerWidget<K, A>>,
    onClick: OnClick,
    pad: MIDIStructorPad
  ) => React.ReactElement
}): MIDIStructorWidget<K, A> => ({
  widget: ControllerWidget.intersect(opts.widget, UIBaseSchema),
  Component: opts.Component,
})

export const MIDIStructorWidget = {
  of,
}
