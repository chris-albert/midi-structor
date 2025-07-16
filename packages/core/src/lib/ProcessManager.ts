const IS_WEB_WORKER = typeof window === 'undefined'

export type ProcessType = 'main' | 'project' | 'controller'

const name = self.name

const getType = (): ProcessType => {
  if (IS_WEB_WORKER && typeof self !== 'undefined') {
    if (name === 'project') {
      return 'project'
    } else {
      return 'controller'
    }
  } else {
    return 'main'
  }
}

const type = getType()

const processTypeColor = (type: ProcessType): string => {
  if (type === 'main') {
    return '32'
  } else if (type === 'project') {
    return '34'
  } else {
    return '33'
  }
}

const color = processTypeColor(type)

const isWorker = IS_WEB_WORKER

export const ProcessManager = {
  type,
  name,
  isMain: type === 'main',
  isProject: type === 'project',
  isController: type === 'controller',
  isWorker,
  color,
}
