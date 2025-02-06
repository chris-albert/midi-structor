import { Service, AgentService, Midi } from '@midi-structor/core'
import React from 'react'

const useAgentService = (): AgentService => {
  const agentEmitter = Midi.useAgentEmitter()
  const agentListener = Midi.useAgentListener()

  return Service.Client(AgentService, Service.MidiProtocol(agentEmitter, agentListener))
}

const useDevices = () => {
  const agentService = useAgentService()
  const [devices, setDevices] = React.useState<Array<string>>([])

  React.useEffect(() => {
    agentService.AvailableDevices({}).then((result) => {
      console.log('result', result)
    })
  }, [])

  return {
    devices,
  }
}

export const AgentHooks = {
  useDevices,
}
