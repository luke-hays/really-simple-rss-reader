declare interface RssFeedItem {
  title: string,
  link: string,
  description: string,
  pubDate: string
}

declare interface RssFeedStorage extends RssFeedItem {
  title: string,
  link: string,
  description: string,
  items: Array<RssFeedItem>
}