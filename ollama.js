import ollama from 'ollama'

const message = { role: 'user', content: 'Why is the sky blue?' }
const response = await ollama.chat({ model: 'llama3.1', messages: [message], stream: true })
for await (const part of response) {
  process.stdout.write(part.message.content)
}

import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // required but unused
})

btn.addEventListener('click', async () => {

  const completion = await openai.chat.completions.create({
    model: 'phi4',
    messages: [{ role: 'user', content: 'Why is the sky blue?' + checkInput.value }],
  })

  console.log(completion.choices[0].message.content)

  const p = document.createElement("p")
  p.innerText = completion.choices[0].message.content
  checkResultsElement.appendChild(p)
})