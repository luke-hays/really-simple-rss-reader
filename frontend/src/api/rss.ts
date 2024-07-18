import {getRequest, postRequest} from "./api";

export const getRssFeedList = async () => {
  try {
    const response = await getRequest({ path: 'rss' })
    const body = await response.json()

    const rssList = body ?? []

    console.log(rssList)

    return rssList as RssFeedList
  } catch (error: any) {
    console.error(error)
  }
}

export const addRssFeed = async (rssFeedSource: string) => {
  try {
    const response = await postRequest({
      path: 'rss', options: {
        body: JSON.stringify({ source: rssFeedSource })
      }
    })

    const body = await response.json()

    console.log(body)
  } catch (error: any) {
    console.error(error)
  }
}