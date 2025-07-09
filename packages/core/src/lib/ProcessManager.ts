const IS_WEB_WORKER = typeof window === 'undefined'

export type ProcessType = 'main' | 'project' | 'controller'

const processTypeColor = (type: ProcessType): string => {
  if (type === 'main') {
    return '32'
  } else if (type === 'project') {
    return '34'
  } else {
    return '33'
  }
}

const getType = (): ProcessType => {
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

const isWorker = () => IS_WEB_WORKER

export const ProcessManager = {
  getType,
  isWorker,
  processTypeColor,
}
