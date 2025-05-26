import { createLinter, loadTextlintrc, loadLinterFormatter } from "textlint";

import { app, BrowserWindow, ipcMain } from 'electron/main';
import path, { dirname } from 'path'
import { fileURLToPath } from "url";

import { Ollama } from 'ollama';

async function handleTextLint(event, text) {
  const descriptor = await loadTextlintrc();
  const linter = createLinter({ descriptor });
  const results = await linter.lintText(text,'foo.md');

  console.log(results);
  return results.messages

}

async function handleOllama(event, text) {

  const ollama = new Ollama({host: 'http://localhost:11434'})
  const message = { role: 'user', content: '以下の文章をエンジニアとしてより伝わるような内容にするための改善案を挙げてください。その上で、改善後の文章案を作成してください。 ###校正してほしい文章:' + text }
  const response = await ollama.chat({ model: 'deepseek-r1', messages: [message]})

  return response

}

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