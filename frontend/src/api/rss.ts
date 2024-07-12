import { getRequest } from "./api";
import RssFeed from '../models/RssFeed'

export const getRssFeed = async () => {
  try {
    const response = await getRequest({ path: 'rss' })
    const documentString = await response.text()

    const parser = new DOMParser()
    const document = parser.parseFromString(documentString, 'application/xhtml+xml')

    if (document.querySelector('parseError')) throw new Error('parseError')

    const rssFeed = new RssFeed(document)

    return rssFeed
  } catch (error: any) {
    console.error(error)
  }
}