import { Schema } from 'effect'
import { Service } from '../service/Service'
import { MidiDeviceType, MidiType } from '../midi/GlobalMidi'

const StringOrUndefined = Schema.Union(Schema.String, Schema.Undefined)
const Empty = Schema.Any
export const AgentService = Service.build({
  AvailableDevices: {
    request: Empty,
    response: Schema.Struct({
      inputs: Schema.Array(Schema.String),
      outputs: Schema.Array(Schema.String),
    }),
  },
  SetDevice: {
    request: Schema.Struct({
      name: StringOrUndefined,
      midiType: MidiType,
      midiDeviceType: MidiDeviceType,
    }),
    response: Empty,
  },
  DeviceState: {
    request: Empty,
    response: Schema.Struct({
      controller: Schema.Struct({
        input: StringOrUndefined,
        output: StringOrUndefined,
      }),
      daw: Schema.Struct({
        input: StringOrUndefined,
        output: StringOrUndefined,
      }),
    }),
  },
  Health: {
    request: Empty,
    response: Schema.Struct({
      status: Schema.String,
    }),
  },
})

export type AgentService = Service.Impl<typeof AgentService>
