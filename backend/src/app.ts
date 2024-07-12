import express from 'express'

const app = express()
const PORT = 3001

app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})