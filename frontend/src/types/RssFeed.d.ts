declare interface RssFeed {
  title: string,
  source: string,
  description: string,
  _id: string
}

declare interface RssFeedList extends Array<RssFeedList> {
  title: string,
  source: string,
  description: string,
  _id: string
  items: Array<RssFeed>
}