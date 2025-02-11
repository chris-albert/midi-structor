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

const useAgentDevices = (deviceType: MidiDeviceType, type: MidiType): MidiDeviceSelection => {
  const agentService = useAgentService()
  const [devices, setDevices] = React.useState<Array<string>>([])
  const [selected, setSelected] = React.useState<Option.Option<string>>(Option.none())

  React.useEffect(() => {
    agentService.DeviceState({}).then((state) => {
      if (type === 'controller') {
        setSelected(
          Option.fromNullable(deviceType === 'input' ? state.controller.input : state.controller.output),
        )
      } else {
        setSelected(Option.fromNullable(deviceType === 'input' ? state.daw.input : state.daw.output))
      }
    })

    agentService.AvailableDevices({}).then((result) => {
      if (deviceType === 'input') {
        setDevices([...result.inputs])
      } else {
        setDevices([...result.outputs])
      }
    })
  }, [])

  const deviceSelected = (selected: string | undefined) => {
    setSelected(Option.fromNullable(selected))
    agentService.SetDevice({ name: selected, midiType: type, midiDeviceType: deviceType })
  }

  return {
    type: deviceType,
    devices,
    selected: Option.getOrUndefined(selected),
    setSelected: deviceSelected,
  }
}

const useAgentControllerEnabled = () => {
  const agentService = useAgentService()

  const [enabled, setEnabled] = React.useState<boolean>(false)

  const onSetEnabled = (enabled: boolean) => {
    setEnabled(enabled)
    agentService.SetControllerEnabled({ enabled })
  }

  React.useEffect(() => {
    agentService.DeviceState({}).then((state) => {
      setEnabled(state.controller.enabled)
    })
  }, [])

  return [enabled, onSetEnabled] as const
}

export const AgentHooks = {
  useAgentDevices,
  useAgentControllerEnabled,
}
