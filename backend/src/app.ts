import express from 'express'
import routes from './routes/routes.js'

const app = express()
const PORT = 3001

app.get('/', (_, res) => {
  res.send('Hello World!')
})

routes.forEach(({path, route}) => {
  app.use(path, route)
})

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})