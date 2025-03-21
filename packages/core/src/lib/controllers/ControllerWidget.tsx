import React from 'react'
import { Schema } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'

export type ControllerWidget<A> = {
  schema: Schema.Schema<A>
  targets: (a: A) => Array<MidiTarget>
  component: (a: A) => React.ReactElement
}
