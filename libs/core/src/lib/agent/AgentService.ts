import { Option, Schema } from 'effect'
import { Endpoints, Service, ServiceEndpoint, ServiceImpl } from '../service/Service'

type Endpoint = {}

// Get Available Devices
export const GetAvailableDevicesRequest = Schema.Struct({})

export type GetAvailableDevicesRequest = Schema.Schema.Type<typeof GetAvailableDevicesRequest>

export const GetAvailableDevicesResponse = Schema.Struct({
  inputs: Schema.Array(Schema.String),
  outputs: Schema.Array(Schema.String),
})

export type GetAvailableDevicesResponse = Schema.Schema.Type<typeof GetAvailableDevicesResponse>

// Health
export const HealthRequest = Schema.Struct({})

export type HealthRequest = Schema.Schema.Type<typeof HealthRequest>

export const HealthResponse = Schema.Struct({
  status: Schema.String,
})

export type HealthResponse = Schema.Schema.Type<typeof HealthResponse>

const AvailableDevices: ServiceEndpoint<GetAvailableDevicesRequest, GetAvailableDevicesResponse> = {
  request: GetAvailableDevicesRequest,
  response: GetAvailableDevicesResponse,
}

const Health = {
  request: HealthRequest,
  response: HealthResponse,
}

const TargetSchema = Schema.Struct({
  target: Schema.String,
})

const target = (input: any): Option.Option<string> =>
  Option.map(Schema.decodeUnknownOption(TargetSchema)(input), (s) => s.target)

const endpoints: Endpoints = {
  AvailableDevices,
  Health,
}

export const AgentService: Service<Endpoints> = {
  target,
  endpoints,
}

export type AgentService = ServiceImpl<typeof AgentService, typeof endpoints>

type a = keyof typeof endpoints
