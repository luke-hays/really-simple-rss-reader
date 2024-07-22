import {getRequest, postRequest} from "./api";

export const getRssFeedList = async () => {
  try {
    const response = await getRequest({ path: 'rss' })
    const body = await response.json()

    const rssList = body ?? []

    return rssList as RssFeedList
  } catch (error: any) {
    throw error
  }
}

export const addRssFeed = async (rssFeedSource: string) => {
  try {
    const response = await postRequest({
      path: 'rss', options: {
        body: JSON.stringify({ source: rssFeedSource })
      }
    })

    const rss = await response.json()

    return rss
  } catch (error: any) {
    throw error
  }
}