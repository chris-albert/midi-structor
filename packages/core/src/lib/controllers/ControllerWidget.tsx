import React from 'react'
import { Schema, SchemaAST } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'

export type ControllerWidget<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any
> = {
  name: K
  schema: Schema.TaggedStruct<K, A>
  targets: (a: Schema.Struct.Type<A>) => Array<MidiTarget>
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
}

export type ControllerWidgetProps<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any
> = {
  name: K
  schema: Schema.Struct<A>
  targets: (a: Schema.Struct.Type<A>) => Array<MidiTarget>
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
}

const of = <K extends SchemaAST.LiteralValue, A extends Schema.Struct.Fields>(
  props: ControllerWidgetProps<K, A>
): ControllerWidget<K, A> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, props.schema.fields),
  targets: props.targets,
  component: props.component,
})

const intersect = <
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields,
  B extends Schema.Struct.Fields
>(
  widget: ControllerWidget<K, A>,
  bSchema: Schema.Struct<B>
): ControllerWidget<K, A & B> =>
  of({
    name: widget.name,
    schema: Schema.Struct({
      ...widget.schema.fields,
      ...bSchema.fields,
    }) as Schema.Struct<A & B>,
    targets: (f) => widget.targets(f as Schema.Struct.Type<A>),
    component: (f) => widget.component(f as Schema.Struct.Type<A>),
  })

export const ControllerWidget = {
  of,
  intersect,
}

export type ResolvedControllerWidget<A = any> = {
  name: string
  targets: () => Array<MidiTarget>
  component: () => React.ReactElement
  widget: A
}

export type ControllerWidgetType<A extends ControllerWidget> =
  A['schema']['Type']

export type ControllerWidgetsType<A extends Array<ControllerWidget>> = {
  [K in keyof A]: ControllerWidgetType<A[K]>
}
