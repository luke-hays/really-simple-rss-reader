declare interface RssFeed {
  title: string,
  source: string,
  description: string,
}

declare interface RssFeedList extends Array<RssFeedList> {
  title: string,
  source: string,
  description: string,
  items: Array<RssFeed>
}