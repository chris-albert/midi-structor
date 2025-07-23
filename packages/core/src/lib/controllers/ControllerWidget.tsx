import React from 'react'
import { Data, Schema, SchemaAST } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'
import { SchemaForm } from './widgets/form/SchemaForm'

const TargetSchema = Schema.Struct({
  target: MidiTarget.Schema,
})

type TargetSchema = typeof TargetSchema.Type
type TargetSchemaFields = typeof TargetSchema.fields

const TargetsSchema = Schema.Struct({
  targets: Schema.Array(MidiTarget.Schema).annotations(
    SchemaForm.annotation('MidiTargets')
  ),
})

type TargetsSchema = typeof TargetsSchema.Type
type TargetsSchemaFields = typeof TargetsSchema.fields

const WidgetInputNone = Schema.TaggedStruct('none', {})
const WidgetInputOne = Schema.TaggedStruct('one', TargetSchema.fields)
const WidgetInputMany = Schema.TaggedStruct('many', TargetsSchema.fields)

const WidgetInput = Schema.Union(
  WidgetInputNone,
  WidgetInputOne,
  WidgetInputMany
)

export type WidgetInput = typeof WidgetInput.Type

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
  init: (i: In) => Schema.Struct.Type<A>
  inputType: In['_tag']
}

export type ControllerWidgetKey<A> = A extends ControllerWidget<
  infer K,
  infer A,
  infer In
>
  ? K
  : never

export type ControllerWidgetValue<A> = A extends ControllerWidget<
  infer K,
  infer A,
  infer In
>
  ? A
  : never

export type ControllerWidgetInput<A> = A extends ControllerWidget<
  infer K,
  infer A,
  infer In
>
  ? In
  : never

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
  init: (i: In) => Schema.Struct.Type<A>
  inputType: In['_tag']
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
  inputType: props.inputType,
})

/**
 * Controller Widget with no targets
 */

export type ControllerWidgetPropsNone<
  K extends SchemaAST.LiteralValue = any,
  A extends Schema.Struct.Fields = any
> = {
  name: K
  schema: Schema.Struct<A>
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
  init: () => Schema.Struct.Type<A>
  tracks?: (a: Schema.Struct.Type<A>) => Array<string>
}

const none = <K extends SchemaAST.LiteralValue, A extends Schema.Struct.Fields>(
  props: ControllerWidgetPropsNone<K, A>
): ControllerWidget<K, A, typeof WidgetInputNone.Type> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, {
    ...props.schema.fields,
  }) as Schema.TaggedStruct<K, A & {}>,
  targets: (w: any) => ({ _tag: 'none' }),
  component: props.component,
  tracks: props.tracks || (() => []),
  init: () => ({
    _tag: props.name,
    ...(props.init() as any),
  }),
  inputType: 'none',
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
): ControllerWidget<K, A & TargetSchemaFields, typeof WidgetInputOne.Type> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, {
    ...TargetSchema.fields,
    ...props.schema.fields,
  }) as Schema.TaggedStruct<K, A & TargetSchemaFields>,
  targets: (w: any) => ({ _tag: 'one', target: w.target }),
  component: props.component,
  tracks: props.tracks || (() => []),
  init: (input) => ({
    _tag: props.name,
    target: input.target,
    ...(props.init() as any),
  }),
  inputType: 'one',
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
): ControllerWidget<
  K,
  A & TargetsSchemaFields,
  typeof WidgetInputMany.Type
> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, {
    ...TargetsSchema.fields,
    ...props.schema.fields,
  }) as Schema.TaggedStruct<K, A & TargetsSchemaFields>,
  targets: (w: any) => ({ _tag: 'many', targets: w.targets }),
  component: props.component,
  tracks: props.tracks || (() => []),
  init: (input) => ({
    _tag: props.name,
    targets: input.targets,
    ...(props.init() as any),
  }),
  inputType: 'many',
})

const intersect = <
  K extends SchemaAST.LiteralValue,
  A extends Schema.Struct.Fields,
  B extends Schema.Struct.Fields,
  In extends WidgetInput
>(
  widget: ControllerWidget<K, A>,
  bSchema: Schema.Struct<B>,
  bInit: (i: In) => Schema.Struct.Type<B>
): ControllerWidget<K, A & B, In> =>
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
    init: (input) => ({
      ...(widget.init(input) as any),
      ...(bInit(input) as any),
    }),
    inputType: widget.inputType,
  })

export const ControllerWidget = {
  of,
  none,
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
