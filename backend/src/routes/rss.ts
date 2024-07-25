import express from 'express';
import {JSDOM} from 'jsdom';
import {ObjectId} from 'mongodb';
import {CacheClient} from '../cache/client';

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
  const ttl = document.querySelector('ttl')?.textContent

  const items : Array<{title: string, description: string, source: string}> = []

  document.querySelectorAll('item').forEach(item => {
    items.push({
      title: queryRssDocument(item, 'title'),
      description: queryRssDocument(item, 'description'),
      source: queryRssDocument(item, 'link')
    })
  })

  return {title, description, ttl, items}
}

const getCacheExpirationTime = (cacheControl : string | null, rssTtl? : string | null) => {
  // Default to an hour
  const DEFAULT_TIME = 3600
  let expiration = DEFAULT_TIME

  // If the rss provides a ttl we'll use that value first
  if (rssTtl) {
    // ttl element is in minutes in RSS spec
    expiration = parseInt(rssTtl) * 60
  }

  // If the cache control is set to anything other than 0, then that will be the authoritative cache time
  if (cacheControl) {
    const match = cacheControl.match(/max-age=(\d+)/)
    if (match) {
      const time = parseInt(match[1])
      expiration = time === 0 ? DEFAULT_TIME : time
    }
  }

  console.log('cache expiration: ', expiration)

  return expiration
}

// Cache the new rss feed's items
// Expiration time should be set using either the Cache Control header from our response OR the TTL element from the rss doc
// If these fail the default fallback is set to an hour
const addFeedToCache = async (cache : CacheClient, key : string, value : string, ttl : number = 3600) => {
    await cache.set(key, value, {EX: ttl})
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

    res.json(rssFeeds)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const cachedItems = await req.cache.get(req.params.id)

    if (cachedItems != null) {
      console.log('Cache Hit')
      // RSS Feed items are cached as stringified JSON object
      const parsedItems = JSON.parse(cachedItems)

      res.json(parsedItems)
      return
    }

    console.log('Cache Miss')

    const id = new ObjectId(req.params.id)

    const collection = req.db.read(dbConfig)
  
    const rss = await collection
      .findOne({_id: id})
  
    if (rss == null) throw new Error('Unable to find record with id')

    const rssDoc = await fetch(rss.source)
    const body = await rssDoc.text()

    const {items, ttl} = parseRss(body)

    const expiration = getCacheExpirationTime(rssDoc.headers.get('cache-control'), ttl)
    
    // Run the cache strategy again after fetching items for the feed
    await addFeedToCache(req.cache, req.params.id, JSON.stringify(items), expiration)

    res.json(items)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    // Check if valid source. Insert into table if valid
    // https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
    // This is the only input provided, and in a real world scenario needs to be locked down tight
    
    // TODO Validate Source https://validator.w3.org/feed/docs/soap.html
    const source = req.body['source']
    
    // If the source looks legit, we need to fetch some data from it to add to the database, like a title and description
    const rssDoc = await fetch(source)

    const body = await rssDoc.text()

    const {title, description, items, ttl} = parseRss(body)

    const newRssFeed = {title, description, source}

    const record = await req.db.insertRecord(dbConfig, newRssFeed)

    const expiration = getCacheExpirationTime(rssDoc.headers.get('cache-control'), ttl)

    await addFeedToCache(req.cache, record.insertedId.toString(), JSON.stringify(items), expiration)

    // Send this record back so that the UI can render the new RSS Feed
    res.send({...newRssFeed, items})
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const collection = req.db.read(dbConfig)
    const id = new ObjectId(req.params.id)

    await collection.deleteOne({_id: id})
    await req.cache.delete(req.params.id)

    res.send().status(200)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

export default router