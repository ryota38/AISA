const btn = document.getElementById('btn')
const checkResultsElement = document.getElementById('checkResults')

btn.addEventListener('click', async () => {
  const checkResults = await window.electronAPI.textlint(checkInput.value)
  
  checkResultsElement.innerText = ''

  checkResults.forEach(result => {
    const p = document.createElement("p")
    p.innerText = result.line + '行目：' + result.message
    checkResultsElement.appendChild(p)
  });
  
  // checkResultsElement.innerText = checkResults.message
})

const AIcheckbtn = document.getElementById('AIcheckbtn')

AIcheckbtn.addEventListener('click', async () => {
  const checkResults = await window.electronAPI.ollama(checkInput.value)
  
  checkResultsElement.innerText = ''

  checkResultsElement.innerText = checkResults.message.content
  
})