import express from 'express';

// Can create a Router instance that can have middleware loaded and define routes
// This can be exported and mounted on a path in our application
// For now, these routes are consolidated in the routes.ts file
// https://expressjs.com/en/guide/routing.html
const router = express.Router();

// We will define a more specific route in routes.ts
// Asynchronous route handling and middleware require passing the error to next
// Express will then catch them and can be handled with middleware
// https://expressjs.com/en/guide/error-handling.html
router.get('/', async (_, res, next) => {
  try {
    const response = await fetch('https://news.ycombinator.com/rss')
    const responseText = await response.text()
  
    res.send(responseText)
  } catch (error) {
    next(error)
  }
})

export default router