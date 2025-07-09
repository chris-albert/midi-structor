import { ProcessManager } from '../ProcessManager'

type StateManager = {}

const init = (): StateManager => {
  const accessType = ProcessManager.type
  console.log('StateManager initialized', accessType)
  const managerName = `state-manager-${accessType}`

  const channel = new BroadcastChannel(managerName)

  channel.onmessage = (event: MessageEvent) => {
    console.log('StateManager.onmessage', managerName, event)
  }

  return {}
}

let STATE_MANAGER: StateManager | undefined = undefined
const getDefault = (): StateManager => {
  if (STATE_MANAGER === undefined) {
    STATE_MANAGER = init()
  }
  return STATE_MANAGER
}

export const StateManager = {
  getDefault,
}
