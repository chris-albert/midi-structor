const IS_WEB_WORKER = typeof window === 'undefined'

type StateAccessType = 'main' | 'project' | 'controller'

const getAccessType = (): StateAccessType => {
  if (IS_WEB_WORKER && typeof self !== 'undefined') {
    const name = self.name
    if (name === 'project') {
      return 'project'
    } else {
      return 'controller'
    }
  } else {
    return 'main'
  }
}

type StateManager = {}

const init = (): StateManager => {
  const accessType = getAccessType()
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
