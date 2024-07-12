import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('rss feeds requested')
})

export default router