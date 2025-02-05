import { GetDevicesMessage } from '@midi-structor/core'
import { Either } from 'effect'
import * as easymidi from 'easymidi'

const getDevicesMessage = (getDevicesMessage: GetDevicesMessage) => {
  const inputs = easymidi.getInputs()
  const outputs = easymidi.getOutputs()

  return Either.right({ inputs, outputs })
}
export const Devices = {
  getDevicesMessage,
}
