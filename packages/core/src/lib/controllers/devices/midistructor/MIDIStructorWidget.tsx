import React from 'react'
import { Schema, SchemaAST } from 'effect'
import { MidiTarget } from '../../../midi/MidiTarget'
import {
  ControllerWidget,
  ControllerWidgetTarget,
  ControllerWidgetTargets,
  ControllerWidgetType,
} from '../../ControllerWidget'
import { MIDIStructorPad } from '../MidiStructorMessage'

export type OnClick = (target: MidiTarget) => void

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

const defaultBase = (): typeof UIBaseSchema.Type => ({})

type ComponentNoPad<
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields
> = (widget: ControllerWidgetType<ControllerWidget<K, A>>) => React.ReactElement

type ComponentWithPad<
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields
> = (
  widget: ControllerWidgetType<ControllerWidget<K, A>>,
  onClick: OnClick,
  pad: MIDIStructorPad
) => React.ReactElement

type ComponentWithPads<
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields
> = (
  widget: ControllerWidgetType<ControllerWidget<K, A>>,
  onClick: OnClick,
  pads: Array<MIDIStructorPad>
) => React.ReactElement

type WidgetComponent<
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields
> = ControllerWidgetType<ControllerWidget<K, A>> extends ControllerWidgetTarget
  ? ComponentWithPad<K, A>
  : ControllerWidgetType<ControllerWidget<K, A>> extends ControllerWidgetTargets
  ? ComponentWithPads<K, A>
  : ComponentNoPad<K, A>

export type MIDIStructorWidget<
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields
> = {
  widget: ControllerWidget<K, A & typeof UIBaseSchema.fields>
  Component: WidgetComponent<K, A>
}

const of = <
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields
>(opts: {
  widget: ControllerWidget<K, A>
  Component: WidgetComponent<K, A>
}): MIDIStructorWidget<K, A> => ({
  widget: ControllerWidget.intersect(opts.widget, UIBaseSchema, defaultBase),
  Component: opts.Component,
})

export const MIDIStructorWidget = {
  of,
}
