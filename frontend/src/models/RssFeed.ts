const queryRssDocument = (rssFeed : Document | Element, selector : string) => {
  return rssFeed.querySelector(selector)?.textContent?.trim() ?? ''
}

class RssFeedElements {
  title: string
  description: string
  source: string
  items : Array<RssFeed> = []

  constructor(rssFeed: Document) {
    this.title = queryRssDocument(rssFeed, 'title')
    this.description = queryRssDocument(rssFeed, 'description')
    this.source = queryRssDocument(rssFeed, 'link')

    rssFeed.querySelectorAll('item').forEach(item => {
      this.items.push({
        title: queryRssDocument(item, 'title'),
        description: queryRssDocument(item, 'description'),
        source: queryRssDocument(item, 'link')
      })
    })
  }
}

export default RssFeedElements