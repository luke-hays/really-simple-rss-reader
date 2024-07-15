import express from 'express';

// Can create a Router instance that can have middleware loaded and define routes
// This can be exported and mounted on a path in our application
// For now, these routes are consolidated in the routes.ts file
// https://expressjs.com/en/guide/routing.html
const router = express.Router();
const dbConfig = {dbName: 'rss', collectionName: 'feeds'}

// We will define a more specific route in routes.ts
// Asynchronous route handling and middleware require passing the error to next
// Express will then catch them and can be handled with middleware
// https://expressjs.com/en/guide/error-handling.html
router.get('/', async (req, res, next) => {
  try {
    const collection = req.db.read(dbConfig)

    const rssFeeds = await collection
      .find()
      .toArray()

    res.json({rssFeeds})
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    // Check if valid source. Insert into table if valid
    const source = req.body['source']
    const rssDoc = await fetch(source)
    console.log(rssDoc)

    throw new Error('test')

    await req.db.insertRecord(dbConfig, {})

    res.send()
  } catch (error) {
    next(error)
  }
})

export default router