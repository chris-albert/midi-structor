import { ProcessManager } from '../ProcessManager'

//Took inspiration from:
//https://leafty.medium.com/getting-started-with-logging-in-react-e8d493458689
//https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number

export type LogFn = (message: string, ...optionalParams: any[]) => void

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type Logger = {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
  noop: LogFn
  enabled: (p: boolean, f: LogFn) => LogFn
  timed: <A>(message: string, f: () => A) => (level: LogLevel) => A
}

const NO_OP: LogFn = () => {}

const logger = (): Logger => {
  const stateType = ProcessManager.type
  const ansiColor = ProcessManager.color

  const message = `\x1b[${ansiColor}m[${stateType}]\x1b[0m %s`

  const timed =
    <A>(message: string, f: () => A) =>
    (level: LogLevel): A => {
      const startTime = performance.now()
      const result = f()
      const endTime = performance.now()
      const totalTime = Math.floor((endTime - startTime) * 1000)
      console.info(`TIMED ${totalTime}us: ${message}`)
      return result
    }

  return {
    debug: console.debug.bind(console, message),
    info: console.info.bind(console, message),
    warn: console.warn.bind(console, message),
    error: console.error.bind(console, message),
    noop: NO_OP,
    enabled: (p: boolean, f: LogFn) => {
      if (p) {
        return f
      } else {
        return NO_OP
      }
    },
    timed,
  }
}

export const log = logger()
