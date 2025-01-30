import { Reconciler } from './reconciler'
import { ReactNode } from 'react'

// https://github.com/chentsulin/awesome-react-renderer

const render = (node: ReactNode) => {
  console.log('Rendering react-midi')
  const info = { root: undefined }
  const container = Reconciler.instance.createContainer(
    info,
    0,
    null,
    true,
    null,
    'Midi',
    console.error,
    null,
  )
  Reconciler.instance.updateContainer(node, container, null, () => {
    console.log('Done rendering wooohoooo', info)
  })
}

export const ReactMidiRenderer = {
  render,
}
