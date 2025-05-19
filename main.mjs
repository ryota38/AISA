import { createLinter, loadTextlintrc, loadLinterFormatter } from "textlint";

import { app, BrowserWindow, ipcMain } from 'electron/main';
import path, { dirname } from 'path'
import { fileURLToPath } from "url";

async function handleTextLint(event, text) {
  const descriptor = await loadTextlintrc();
  const linter = createLinter({ descriptor });
  const results = await linter.lintText(text,'foo.md');

  console.log(results);
  return results.messages

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
