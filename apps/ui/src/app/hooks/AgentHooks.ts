import {
  Service,
  AgentService,
  Midi,
  MidiDeviceSelection,
  MidiDeviceType,
  MidiType,
} from '@midi-structor/core'
import React from 'react'
import { Option } from 'effect'

const useAgentService = (): AgentService => {
  const agentEmitter = Midi.useAgentEmitter()
  const agentListener = Midi.useAgentListener()

  return React.useMemo(
    () => Service.Client(AgentService, Service.MidiProtocol(agentEmitter, agentListener)),
    [agentListener, agentEmitter],
  )
}

const useAgentServiceQuery = (): Service.QueryImpl<typeof AgentService> => {
  const agentService = useAgentService()

  return React.useMemo(
    () =>
      Service.Query(agentService, {
        SetControllerEnabled: 'DeviceState',
        SetDevice: 'DeviceState',
      }),
    [agentService],
  )
}

const useAgentDevices = (deviceType: MidiDeviceType, type: MidiType): MidiDeviceSelection => {
  const agentServiceQuery = useAgentServiceQuery()
  const availableDevices = agentServiceQuery.useQueryAvailableDevices({})
  const deviceState = agentServiceQuery.useQueryDeviceState({})
  const setDevice = agentServiceQuery.useMutateSetDevice()

  const devices = React.useMemo(() => {
    if (availableDevices.isSuccess) {
      if (deviceType === 'input') {
        return [...availableDevices.data.inputs]
      } else {
        return [...availableDevices.data.outputs]
      }
    } else {
      return []
    }
  }, [availableDevices.isSuccess, availableDevices.data])

  const selected = React.useMemo(() => {
    if (deviceState.isSuccess) {
      if (type === 'controller') {
        return Option.fromNullable(
          deviceType === 'input' ? deviceState.data.controller.input : deviceState.data.controller.output,
        )
      } else {
        return Option.fromNullable(
          deviceType === 'input' ? deviceState.data.daw.input : deviceState.data.daw.output,
        )
      }
    } else {
      return Option.none()
    }
  }, [deviceState.isSuccess, deviceState.data])

  const deviceSelected = (selected: string | undefined) => {
    setDevice.mutate({ name: selected, midiType: type, midiDeviceType: deviceType })
  }

  return {
    type: deviceType,
    devices,
    selected: Option.getOrUndefined(selected),
    setSelected: deviceSelected,
  }
}

const useAgentControllerEnabled = () => {
  const agentServiceQuery = useAgentServiceQuery()
  const deviceState = agentServiceQuery.useQueryDeviceState({})
  const setEnabled = agentServiceQuery.useMutateSetControllerEnabled()

  const onSetEnabled = (enabled: boolean) => {
    setEnabled.mutate({ enabled })
  }

  const enabled = React.useMemo(
    () => (deviceState.isSuccess ? deviceState.data.controller.enabled : false),
    [deviceState.isSuccess, deviceState.data],
  )

  return [enabled, onSetEnabled] as const
}

export const AgentHooks = {
  useAgentDevices,
  useAgentControllerEnabled,
}
