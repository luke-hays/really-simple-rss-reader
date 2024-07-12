import express from 'express'
import cors from 'cors'
import routes from './routes/routes.js'

const app = express()
const PORT = 3001

// Mddleware to enable CORS
// Simple Usage for this project - more documentation here. 
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors())

routes.forEach(({path, route}) => {
  app.use(path, route)
})

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})