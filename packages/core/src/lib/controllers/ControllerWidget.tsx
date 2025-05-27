import React from 'react'
import { Schema, SchemaAST } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'

const TargetSchema = Schema.Struct({
  target: MidiTarget.Schema,
})

type TargetSchema = typeof TargetSchema.Type
type TargetSchemaFields = typeof TargetSchema.fields

const TargetsSchema = Schema.Struct({
  targets: Schema.Array(MidiTarget.Schema),
})

type TargetsSchema = typeof TargetsSchema.Type
type TargetsSchemaFields = typeof TargetsSchema.fields

type WidgetInput = MidiTarget | Array<MidiTarget>

export type ControllerWidget<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any,
  In extends WidgetInput = any
> = {
  name: K
  schema: Schema.TaggedStruct<K, A>
  targets: (a: Schema.Struct.Type<A>) => In
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
  tracks: (a: Schema.Struct.Type<A>) => Array<string>
  init?: (i: In) => Schema.Struct.Type<A>
}

export type ControllerWidgetProps<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any,
  In extends WidgetInput = any
> = {
  name: K
  schema: Schema.Struct<A>
  targets: (a: Schema.Struct.Type<A>) => In
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
  tracks?: (a: Schema.Struct.Type<A>) => Array<string>
  init?: (i: In) => Schema.Struct.Type<A>
}

const of = <
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields,
  In extends WidgetInput
>(
  props: ControllerWidgetProps<K, A, In>
): ControllerWidget<K, A, In> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, props.schema.fields),
  targets: props.targets,
  component: props.component,
  tracks: props.tracks || (() => []),
  init: props.init,
})

/**
 * Controller Widget with a single target
 */

export type ControllerWidgetPropsOne<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any
> = {
  name: K
  schema: Schema.Struct<A>
  component: (
    a: Schema.Struct.Type<A & TargetSchemaFields>
  ) => React.ReactElement
  init: () => Schema.Struct.Type<A>
  tracks?: (a: Schema.Struct.Type<A & TargetSchemaFields>) => Array<string>
}

const one = <K extends SchemaAST.LiteralValue, A extends Schema.Struct.Fields>(
  props: ControllerWidgetPropsOne<K, A>
): ControllerWidget<K, A & TargetSchemaFields, MidiTarget> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, {
    ...TargetSchema.fields,
    ...props.schema.fields,
  }) as Schema.TaggedStruct<K, A & TargetSchemaFields>,
  targets: (w: any) => w.target,
  component: props.component,
  tracks: props.tracks || (() => []),
  init: (target) => ({
    target,
    ...(props.init() as any),
  }),
})

/**
 * Controller Widget with many targets
 */

export type ControllerWidgetPropsMany<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any
> = {
  name: K
  schema: Schema.Struct<A>
  component: (
    a: Schema.Struct.Type<A & TargetsSchemaFields>
  ) => React.ReactElement
  init: () => Schema.Struct.Type<A>
  tracks?: (a: Schema.Struct.Type<A & TargetsSchemaFields>) => Array<string>
}

const many = <K extends SchemaAST.LiteralValue, A extends Schema.Struct.Fields>(
  props: ControllerWidgetPropsMany<K, A>
): ControllerWidget<K, A & TargetsSchemaFields, Array<MidiTarget>> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, {
    ...TargetsSchema.fields,
    ...props.schema.fields,
  }) as Schema.TaggedStruct<K, A & TargetsSchemaFields>,
  targets: (w: any) => w.targets,
  component: props.component,
  tracks: props.tracks || (() => []),
  init: (targets) => ({
    targets,
    ...(props.init() as any),
  }),
})

const intersect = <
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields,
  B extends Schema.Struct.Fields,
  In extends WidgetInput
>(
  widget: ControllerWidget<K, A>,
  bSchema: Schema.Struct<B>
  // bInit: (i: In) => Schema.Struct.Type<B>
): ControllerWidget<K, A & B> =>
  of({
    name: widget.name,
    schema: Schema.Struct({
      ...widget.schema.fields,
      ...bSchema.fields,
    }) as Schema.Struct<A & B>,
    targets: (f) => widget.targets(f as Schema.Struct.Type<A>),
    component: (f) => widget.component(f as Schema.Struct.Type<A>),
    tracks: (f) =>
      widget.tracks !== undefined
        ? widget.tracks(f as Schema.Struct.Type<A>)
        : [],
    // init: (input) => ({
    //   ...(widget.init(input) as any),
    //   ...(bInit(input) as any),
    // }),
  })

export const ControllerWidget = {
  of,
  one,
  many,
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
