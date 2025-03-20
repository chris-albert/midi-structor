import { Schema } from 'effect'

export const GetDevicesMessage = Schema.TaggedStruct('GetDevicesMessage', {})

export type GetDevicesMessage = Schema.Schema.Type<typeof GetDevicesMessage>

export const HealthMessage = Schema.TaggedStruct('HealthMessage', {})

export type HealthMessage = Schema.Schema.Type<typeof HealthMessage>

export const AgentMessage = Schema.Union(GetDevicesMessage, HealthMessage)

export type AgentMessage = Schema.Schema.Type<typeof AgentMessage>
