import { Option, Schema } from 'effect'
import { ControllerConfig } from './ControllerConfig'
import { v4 } from 'uuid'
import { ControllerConfigOps } from './ControllerConfigOps'
import { EventEmitterWithBroadcast } from '../EventEmitter'
import { MidiEventEmitterWithBroadcast } from '../midi/MidiDevice'

const ConfiguredControllerSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  enabled: Schema.Boolean,
  config: ControllerConfig.Schema,
  device: Schema.String,
  color: Schema.optional(Schema.String),
  selected: Schema.Struct({
    input: Schema.Option(Schema.String),
    output: Schema.Option(Schema.String),
  }),
})

export type ConfiguredController = typeof ConfiguredControllerSchema.Type

const ConfiguredControllersSchema = Schema.Array(ConfiguredControllerSchema)
export type ConfiguredControllers = typeof ConfiguredControllersSchema.Type

const defaultConfiguredController = (name: string): ConfiguredController => ({
  name,
  enabled: true,
  config: ControllerConfigOps.empty(),
  device: 'Launchpad Mini [MK3]',
  selected: {
    input: Option.none(),
    output: Option.none(),
  },
  id: v4(),
})

const virtualListener = (
  controller: ConfiguredController
): MidiEventEmitterWithBroadcast =>
  EventEmitterWithBroadcast(`${controller.id}:listener`)

const virtualEmitter = (
  controller: ConfiguredController
): MidiEventEmitterWithBroadcast =>
  EventEmitterWithBroadcast(`${controller.id}:emitter`)

export const ConfiguredController = {
  Schema: ConfiguredControllerSchema,
  SchemaArray: ConfiguredControllersSchema,
  defaultConfiguredController,
  virtualListener,
  virtualEmitter,
}
