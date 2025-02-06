import { Schema } from 'effect'
import { Service } from '../service/Service'

export const AgentService = Service.build({
  AvailableDevices: {
    request: Schema.Struct({}),
    response: Schema.Struct({
      inputs: Schema.Array(Schema.String),
      outputs: Schema.Array(Schema.String),
    }),
  },
  SetDevice: {
    request: Schema.Struct({
      name: Schema.String,
    }),
    response: Schema.Struct({}),
  },
  Health: {
    request: Schema.Struct({}),
    response: Schema.Struct({
      status: Schema.String,
    }),
  },
})

export type AgentService = Service.Impl<typeof AgentService>
