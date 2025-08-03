import React from 'react'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './app/App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const broadcastChannel = new BroadcastChannel('global-project')

// @ts-ignore
if (window !== undefined && window.electronAPI !== undefined) {
  // @ts-ignore
  window.electronAPI.onProject((project) => {
    broadcastChannel.postMessage(project)
  })
}

root.render(
  // <StrictMode>
  <App />
  // </StrictMode>
)
