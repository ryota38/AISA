const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  textlint: (text) => ipcRenderer.invoke('textlint', text),
  ollama: (text) => ipcRenderer.invoke('ollama', text)
})
