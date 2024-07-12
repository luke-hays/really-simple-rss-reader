import express from 'express';

const router = express.Router();

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