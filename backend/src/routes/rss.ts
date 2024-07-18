import express from 'express';
import {JSDOM} from 'jsdom';

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

    console.log(rssFeeds)

    res.json({rssFeeds})
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    // Check if valid source. Insert into table if valid
    // https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
    // This is the only input provided, and in a real world scenario needs to be locked down tight
    
    // TODO Validate Source
    const source = req.body['source']
    
    // If the source looks legit, we need to fetch some data from it to add to the database, like a title and description
    const rssDoc = await fetch(source)
    const body = await rssDoc.text()

    // Node is not going to have native browser api's to help, so we are going to rely on JSDOM
    // What we really need is the DOMParser class
    // We'll get a document we can select elements on by using the parseFromString method
    const dom = new JSDOM()
    const parser = new dom.window.DOMParser()
    const document = parser.parseFromString(body, 'application/xhtml+xml')

    if (document.querySelector('parseError')) throw new Error('Unable to parse doc string')

    const title = document.querySelector('title')?.textContent
    const description = document.querySelector('description')?.textContent

    const newRssFeed = {
      source,
      title,
      description
    }

    // await req.db.insertRecord(dbConfig, newRssFeed)

    res.send(newRssFeed)
  } catch (error) {
    next(error)
  }
})

export default router