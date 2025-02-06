import { AgentService, Service } from '@midi-structor/core'
import * as easymidi from 'easymidi'

const AvailableDevices: Service.Handler<AgentService, 'AvailableDevices'> = (req) => {
  const inputs = easymidi.getInputs()
  const outputs = easymidi.getOutputs()

  return Promise.resolve({ inputs, outputs })
}

const SetDevices: Service.Handler<AgentService, 'SetDevice'> = (req) => {
  return Promise.reject('')
}

export const Devices = {
  AvailableDevices,
  SetDevices,
}
