declare interface RssFeedItem {
  title: string,
  source: string,
  description: string,
}

declare interface RssFeedStorage extends RssFeedItem {
  title: string,
  source: string,
  description: string,
  items: Array<RssFeedItem>
}