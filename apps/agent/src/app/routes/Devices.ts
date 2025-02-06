import { GetAvailableDevicesRequest, GetAvailableDevicesResponse } from '@midi-structor/core'
import * as easymidi from 'easymidi'

const AvailableDevices = (req: GetAvailableDevicesRequest): Promise<GetAvailableDevicesResponse> => {
  const inputs = easymidi.getInputs()
  const outputs = easymidi.getOutputs()

  return Promise.resolve({ inputs, outputs })
}

export const Devices = {
  AvailableDevices,
}
