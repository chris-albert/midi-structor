import {
  Midi,
  ServiceImpl,
  AgentService,
  BuildClient,
  MidiProtocol,
  GetAvailableDevicesRequest,
} from '@midi-structor/core'
import React from 'react'

const useAgentService = (): AgentService => {
  const agentEmitter = Midi.useAgentEmitter()
  const agentListener = Midi.useAgentListener()

  return BuildClient(AgentService, MidiProtocol(agentEmitter, agentListener))
}

const useDevices = () => {
  const agentService = useAgentService()
  const [devices, setDevices] = React.useState<Array<string>>([])

  React.useEffect(() => {
    const a = GetAvailableDevicesRequest.make({})
    agentService.Health('')
    agentService.AvailableDevices({})
    agentService.AvailableDevices(GetAvailableDevicesRequest.make({})).then((result) => {
      console.log('result', result)
    })
    // agentService.AvailableDevices(GetAvailableDevicesRequest.make({})).then((result) => {
    //   console.log('result', result)
    // })
  }, [])

  return {
    devices,
  }
}

export const AgentHooks = {
  useDevices,
}
