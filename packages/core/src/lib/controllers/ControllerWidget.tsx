import React from 'react'
import { Schema } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'

export type ControllerWidget<A> = {
  name: string
  schema: Schema.Schema<A, any>
  targets: (a: A) => Array<MidiTarget>
  component: (a: A) => React.ReactElement
}

type ControllerWidgetProps<A extends Schema.Struct.Fields> = {
  name: string
  schema: Schema.Struct<A>
  targets: (a: Schema.Struct.Type<A>) => Array<MidiTarget>
  component: (a: Schema.Struct.Type<A>) => React.ReactElement
}

export const ControllerWidget = <A extends Schema.Struct.Fields>(
  props: ControllerWidgetProps<A>
): ControllerWidget<Schema.Struct.Type<A>> => ({
  name: props.name,
  schema: Schema.TaggedStruct(props.name, props.schema.fields) as any as Schema.Schema<
    Schema.Struct.Type<A>,
    any
  >,
  targets: props.targets,
  component: props.component,
})

export type ResolvedControllerWidget = {
  name: string
  targets: () => Array<MidiTarget>
  component: () => React.ReactElement
}
