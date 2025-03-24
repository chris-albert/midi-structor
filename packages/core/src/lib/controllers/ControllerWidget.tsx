import React from 'react'
import { Schema } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'

export type ControllerWidget<A> = {
  name: string
  schema: Schema.Schema<A, any>
  targets: (a: A) => Array<MidiTarget>
  component: (a: A) => React.ReactElement
}

export const ControllerWidget = <A,>(props: ControllerWidget<A>): ControllerWidget<A> => props

export type ResolvedControllerWidget = {
  name: string
  targets: () => Array<MidiTarget>
  component: () => React.ReactElement
}
