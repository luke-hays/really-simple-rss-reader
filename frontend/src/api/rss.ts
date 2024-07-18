import { getRequest, postRequest, } from "./api";

// TODO Make a shared solution for catching errors
export const getRssFeedList = async () => {
  try {
    const response = await getRequest({ path: 'rss' })
    const body = await response.json()

    const rssList = body.rssFeeds ?? []

    return rssList as RssFeedList
  } catch (error: any) {
    console.error(error)
  }
}

export const addRssFeed = async (rssFeedSource : string) => {
  try {
    const response = await postRequest({path: 'rss', options: {
      body: JSON.stringify({source: rssFeedSource})
    }})

    const body = await response.json()

    console.log(body)
  } catch (error: any) {
    console.error(error)
  }
}