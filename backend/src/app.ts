import express from 'express'
import cors from 'cors'
import routes from './routes/routes.js'

const app = express()
const PORT = 3001

app.use(cors())

routes.forEach(({path, route}) => {
  app.use(path, route)
})

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})