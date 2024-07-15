declare interface RssFeedItem {
  title: string,
  source: string,
  description: string,
}

declare interface RssFeedStorage extends RssFeedItem {
  items: Array<RssFeedItem>
}