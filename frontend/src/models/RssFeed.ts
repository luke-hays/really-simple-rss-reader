const queryRssDocument = (rssFeed : Document | Element, selector : string) => rssFeed.querySelector(selector)?.textContent?.trim() ?? ''

class RssFeed implements RssFeedStorage {
  title: string
  description: string
  link: string
  items : Array<RssFeedItem> = []

  constructor(rssFeed: Document) {
    this.title = queryRssDocument(rssFeed, 'title')
    this.description = queryRssDocument(rssFeed, 'description')
    this.link = queryRssDocument(rssFeed, 'link')

    rssFeed.querySelectorAll('item').forEach(item => {
      this.items.push({
        title: queryRssDocument(item, 'title'),
        description: queryRssDocument(item, 'description'),
        link: queryRssDocument(item, 'link')
      })
    })
  }
}

export default RssFeed