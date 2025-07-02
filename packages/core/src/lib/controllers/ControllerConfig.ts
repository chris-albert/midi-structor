import { Schema } from 'effect'

export const ControllerConfigSchema = Schema.Struct({
  widgets: Schema.Array(Schema.Any),
})

export type ControllerConfig = typeof ControllerConfigSchema.Type

export const ControllerConfig = {
  Schema: ControllerConfigSchema,
}
