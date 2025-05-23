import React from 'react'
import { Schema, SchemaAST } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'

const TargetSchema = Schema.Struct({
  target: MidiTarget.Schema,
})

type TargetSchema = typeof TargetSchema.Type

const TargetsSchema = Schema.Struct({
  target: Schema.Array(MidiTarget.Schema),
})

type TargetsSchema = typeof TargetsSchema.Type

export type ControllerWidget<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any
> = {
  name: K
  schema: Schema.TaggedStruct<K, A>
  targets: (a: Schema.Struct.Type<A>) => Array<MidiTarget>
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
  tracks: (a: Schema.Struct.Type<A>) => Array<string>
  // init: () => Schema.Struct.Type<A>
}

export type ControllerWidgetProps<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any
> = {
  name: K
  schema: Schema.Struct<A>
  targets: (a: Schema.Struct.Type<A>) => Array<MidiTarget>
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
  // init: () => Schema.Struct.Type<A>
  tracks?: (a: Schema.Struct.Type<A>) => Array<string>
}

const of = <K extends SchemaAST.LiteralValue, A extends Schema.Struct.Fields>(
  props: ControllerWidgetProps<K, A>
): ControllerWidget<K, A> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, props.schema.fields),
  // init: props.init,
  targets: props.targets,
  component: props.component,
  tracks: props.tracks || (() => []),
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
    // init: widget.init as () => Schema.Struct.Type<A & B>,
    targets: (f) => widget.targets(f as Schema.Struct.Type<A>),
    component: (f) => widget.component(f as Schema.Struct.Type<A>),
    tracks: (f) =>
      widget.tracks !== undefined
        ? widget.tracks(f as Schema.Struct.Type<A>)
        : [],
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
  tracks: () => Array<string>
}

export type ControllerWidgetType<A extends ControllerWidget> =
  A['schema']['Type']

export type ControllerWidgetsType<A extends Array<ControllerWidget>> = {
  [K in keyof A]: ControllerWidgetType<A[K]>
}

export type ControllerWidgetTarget = {
  target: MidiTarget
}

export type ControllerWidgetTargets = {
  targets: Readonly<Array<MidiTarget>>
}
