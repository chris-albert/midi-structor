import { AgentService, Service } from '@midi-structor/core'
import { Devices } from './routes/Devices'

const Health: Service.Handler<AgentService, 'Health'> = (req) => Promise.resolve({ status: 'ok' })

const AgentServiceImpl: AgentService = {
  ...Devices,
  Health,
}

export const Routes = {
  handle: Service.Server(AgentService, AgentServiceImpl).handle,
}
