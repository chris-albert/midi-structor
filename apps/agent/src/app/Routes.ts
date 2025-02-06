import { ServiceImpl, AgentService, HealthRequest, HealthResponse, BuildServer } from '@midi-structor/core'
import { Devices } from './routes/Devices'

const Health = (req: HealthRequest): Promise<string> =>
  // Promise.resolve(HealthResponse.make({ status: 'ok' }))
  Promise.resolve('')

const AgentServiceImpl: ServiceImpl<typeof AgentService> = {
  AvailableDevices: Devices.AvailableDevices,
  Health,
}

export const Routes = {
  handle: BuildServer(AgentService, AgentServiceImpl).handle,
}
