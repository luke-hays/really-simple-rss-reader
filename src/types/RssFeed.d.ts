declare interface RssFeedItem {
  title: string,
  link: string,
  description: string,
}

declare interface RssFeedStorage extends RssFeedItem {
  title: string,
  link: string,
  description: string,
  items: Array<RssFeedItem>
}