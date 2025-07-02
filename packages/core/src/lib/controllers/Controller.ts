import { MidiTarget } from '../midi/MidiTarget'
import { MidiMessage } from '../midi/MidiMessage'
import { ResolvedControllerWidget } from './ControllerWidget'
import { MidiEmitter } from '../midi/MidiEmitter'

export const messageToKey = (message: MidiMessage): string => {
  if (message.type === 'noteon' && message.velocity > 0) {
    return `noteon-${message.note}`
  } else if (message.type === 'cc') {
    return `cc-${message.controllerNumber}`
  } else {
    return ''
  }
}

export type TargetColor = {
  target: MidiTarget
  color: number
  options?: any
}

type EmitterDep<A, B = void> = (e: MidiEmitter) => (a: A) => B

export type Controller = {
  targets: Array<MidiTarget>
  init: EmitterDep<Array<ResolvedControllerWidget>>
  loading: EmitterDep<Controller, () => void>
  render: EmitterDep<Array<TargetColor>>
  listenFilter: (m: MidiMessage) => boolean
}

export type ControllerProps = {
  targets: Array<MidiTarget>
  init: EmitterDep<Array<ResolvedControllerWidget>>
  loading?: EmitterDep<Controller, () => void>
  render: EmitterDep<Array<TargetColor>>
  listenFilter?: (m: MidiMessage) => boolean
}

const of = (props: ControllerProps): Controller => {
  return {
    targets: props.targets,
    init: props.init,
    render: props.render,
    loading: props.loading || (() => () => () => {}),
    listenFilter: props.listenFilter || (() => true),
  }
}

const empty = of({
  targets: [],
  init: () => () => {},
  render: () => () => {},
})

export const Controller = {
  of,
  empty,
}
