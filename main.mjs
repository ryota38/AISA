import { createLinter, loadTextlintrc, loadLinterFormatter } from "textlint";

import { app, BrowserWindow, ipcMain } from 'electron/main';
import path, { dirname } from 'path'
import { fileURLToPath } from "url";

import { Ollama } from 'ollama';

import Store from 'electron-store';

const store = new Store({
  cwd: app.getAppPath()
})

const url = store.get('ollama.url') || 'http://localhost:11434'
const role = store.get('ollama.role') || 'user'
const model = store.get('ollama,model') || 'deepseek-r1'
const prompt = store.get('ollama.prompt') || '以下の文章をエンジニアとしてより伝わるような内容にするための改善案を挙げてください。その上で、改善後の文章案を作成してください。 ###校正してほしい文章:'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(path.dirname(fileURLToPath(import.meta.url)), 'preload.js')
    }
  })

  win.setMenuBarVisibility(false)
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('textlint', handleTextLint)
  ipcMain.handle('ollama', handleOllama)
  createWindow()
})

app.on('window-all-closed', () => {

  store.set('ollama.url', url)
  store.set('ollama.role', role)
  store.set('ollama.model', model)
  store.set('ollama.prompt', prompt)

  if (process.platform !== 'darwin') app.quit()
  })

ipcMain.on('textlint' , (event, text) => {

  console.log(text)

  const engine = new TextLintEngine({
    configFile: path.join(__dirname, ".textlintrc"),
  })

  const results =  engine.executeOnText(text)

  console.log(results)

  event.returnValue = results.messages
})

ipcMain.on('ollama' , (event, text) => {
    console.log(text)
})

async function handleTextLint(event, text) {
  const descriptor = await loadTextlintrc();
  const linter = createLinter({ descriptor });
  const results = await linter.lintText(text,'foo.md');

  console.log(results);
  return results.messages

}

async function handleOllama(event, text) {

  const ollama = new Ollama({host: url})
  const message = { role: role, content: prompt + text }
  const response = await ollama.chat({ model: model, messages: [message]})

  return response

}
