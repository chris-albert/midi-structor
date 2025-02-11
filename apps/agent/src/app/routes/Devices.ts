import { AgentService, Midi, Service } from '@midi-structor/core'
import * as easymidi from 'easymidi'
import { Option } from 'effect'

const AvailableDevices: Service.Handler<AgentService, 'AvailableDevices'> = (req) => {
  const inputs = easymidi.getInputs()
  const outputs = easymidi.getOutputs()

  return Promise.resolve({ inputs, outputs })
}

const SetDevice: Service.Handler<AgentService, 'SetDevice'> = (req) => {
  console.log('Setting device', req)
  Midi.setSelected(Option.fromNullable(req.name), req.midiType, req.midiDeviceType)
  return Promise.resolve({})
}

const DeviceState: Service.Handler<AgentService, 'DeviceState'> = (req) => {
  return Promise.resolve({
    controller: {
      enabled: Midi.getControllerEnabled(),
      input: Option.getOrElse(Midi.getSelected('controller', 'input'), () => undefined),
      output: Option.getOrElse(Midi.getSelected('controller', 'output'), () => undefined),
    },
    daw: {
      input: Option.getOrElse(Midi.getSelected('daw', 'input'), () => undefined),
      output: Option.getOrElse(Midi.getSelected('daw', 'output'), () => undefined),
    },
  })
}

const SetControllerEnabled: Service.Handler<AgentService, 'SetControllerEnabled'> = (req) => {
  Midi.setControllerEnabled(req.enabled)
  return Promise.resolve({})
}

export const Devices = {
  AvailableDevices,
  SetDevice,
  SetControllerEnabled,
  DeviceState,
}
