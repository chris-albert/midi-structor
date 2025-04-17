import React from 'react'
import { Schema } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'

export type ControllerWidget<A extends Schema.Struct.Fields> = {
  name: string
  schema: Schema.Struct<A>
  targets: (a: Schema.Struct.Type<A>) => Array<MidiTarget>
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
}

const of = <A extends Schema.Struct.Fields>(props: ControllerWidget<A>): ControllerWidget<A> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, props.schema.fields) as Schema.Struct<A>,
  targets: props.targets,
  component: props.component,
})

const intersect = <A extends Schema.Struct.Fields, B extends Schema.Struct.Fields>(
  widget: ControllerWidget<A>,
  bSchema: Schema.Struct<B>
): ControllerWidget<A & B> =>
  of({
    name: widget.name,
    schema: Schema.Struct({ ...widget.schema.fields, ...bSchema.fields }) as any as Schema.Struct<A & B>,
    targets: (f) => widget.targets(f as Schema.Struct.Type<A>),
    component: (f) => widget.component(f as Schema.Struct.Type<A>),
  })

export const ControllerWidget = {
  of,
  intersect,
}

export type ResolvedControllerWidget = {
  name: string
  targets: () => Array<MidiTarget>
  component: () => React.ReactElement
  widget: any
}

export type ControllerWidgetType<A extends ControllerWidget<any>> = A['schema']['Type']

export type ControllerWidgetsType<A extends Array<ControllerWidget<any>>> = {
  [K in keyof A]: ControllerWidgetType<A[K]>
}
