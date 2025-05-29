import { MidiReconciler } from './MidiReconciler'
import { ReactNode } from 'react'

// https://github.com/chentsulin/awesome-react-renderer

const render = (node: ReactNode) => {
  const info = { controllers: [] }
  const container = MidiReconciler.instance.createContainer(
    info,
    0,
    null,
    false,
    null,
    'Midi',
    console.error,
    null
  )
  MidiReconciler.instance.updateContainer(node, container, null, () => {})
}

export const MidiRenderer = {
  render,
}
