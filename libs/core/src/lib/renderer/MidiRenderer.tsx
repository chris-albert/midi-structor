import { MidiReconciler } from './MidiReconciler'
import { ReactNode } from 'react'

// https://github.com/chentsulin/awesome-react-renderer

const render = (node: ReactNode) => {
  console.log('Rendering MidiReconciler')
  const info = { root: undefined }
  const container = MidiReconciler.instance.createContainer(
    info,
    0,
    null,
    true,
    null,
    'Midi',
    console.error,
    null,
  )
  MidiReconciler.instance.updateContainer(node, container, null, () => {
    console.log('Done rendering wooohoooo', info)
  })
}

export const MidiRenderer = {
  render,
}
