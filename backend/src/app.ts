import express from 'express'
import cors from 'cors'
import routes from './routes/routes.js'
import {Client} from './db/client.js'

const app = express()
const PORT = 3000

// Create a database object and initialize a connection
// Trying to keep this as encapsulated as possible
const db = new Client()
await db.init()

// Mddleware to enable CORS
// Simple Usage for this project - more documentation here. 
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors())

app.use(express.json())

// Middleware to attach the db object to every request object
// This should make it accessible within every controller
// types/index.d.ts has an extension to the Request interface
// This is to make things behave nicely with typescript
app.use((req, _, next) => {
  req.db = db
  next()
})

// TODO Add logging

routes.forEach(({path, route}) => {
  app.use(path, route)
})

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})