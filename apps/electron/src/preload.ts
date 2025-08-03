import { contextBridge, ipcRenderer } from 'electron'

console.log('inside the preload!!!!')

contextBridge.exposeInMainWorld('electronAPI', {
  onProject: (callback: any) =>
    ipcRenderer.on('server-project', (_event, value) => callback(value)),
})
