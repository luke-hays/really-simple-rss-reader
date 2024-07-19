import express from 'express';
import {JSDOM} from 'jsdom';

const queryRssDocument = (rssFeed : Document | Element, selector : string) => {
  return rssFeed.querySelector(selector)?.textContent?.trim() ?? ''
}

// Node is not going to have native browser api's to help, so we are going to rely on JSDOM
// What we really need is the DOMParser class
// We'll get a document we can select elements on by using the parseFromString method
const parseRss = (rssDocString : string) => {
  const dom = new JSDOM()
  const parser = new dom.window.DOMParser()
  const document = parser.parseFromString(rssDocString, 'application/xhtml+xml')

  if (document.querySelector('parseError')) throw new Error('Unable to parse doc string')

  const title = document.querySelector('title')?.textContent
  const description = document.querySelector('description')?.textContent

  const items : Array<{title: string, description: string, source: string}> = []

  document.querySelectorAll('item').forEach(item => {
    items.push({
      title: queryRssDocument(item, 'title'),
      description: queryRssDocument(item, 'description'),
      source: queryRssDocument(item, 'link')
    })
  })

  return {title, description, items}
}

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

    // We want to grab  the latest content from these feeds
    const latestRssPromises = rssFeeds.map(feed => fetch(feed.source))
    const latestRssResponses = await Promise.allSettled(latestRssPromises)
    
    // Once we finish this, we need to get the text promises from our responses, or handle issues with fetching from source
    const rssFeedStringPromises = latestRssResponses.map(resp => {
      if (resp.status === 'fulfilled') {
        return resp.value.text()
      } else {
        return Promise.reject(null)
      }
    })

    const rssFeedStrings = await Promise.allSettled(rssFeedStringPromises)

    // Similarly, map the results of succesful text calls by parsing them out and handling errors
    // We can map our source for this data by simply using indices
    const parsedRss = rssFeedStrings.map((rssTextResp, i) => {
      if (rssTextResp.status === 'fulfilled') {
        const rss = parseRss(rssTextResp.value)
        return {...rss, source: rssFeeds[i].source}
      } else {
        return {}
      }
    })

    res.json(parsedRss)
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

    const {title, description, items} = parseRss(body)

    const newRssFeed = {title, description, source}

    await req.db.insertRecord(dbConfig, newRssFeed)

    // We'll go ahead and send this record back so that the UI can render the new RSS Feed
    res.send({...newRssFeed, items})
  } catch (error) {
    next(error)
  }
})

export default router