import {getRequest, postRequest, deleteRequest} from "./api";

const BASE_PATH = 'rss'

export const getRssOptions = async () => {
  try {
    const response = await getRequest({ path: BASE_PATH })
    const body = await response.json()

    const rssList = body ?? []

    return rssList as Array<RssFeed>
  } catch (error: any) {
    throw error
  }
}

export const getRssFeed = async (id : string) => {
  try {
    const response = await getRequest({path: `${BASE_PATH}/${id}`})
    const body = await response.json()

    const rssItems = body ?? []

    return rssItems as Array<RssFeed>
  } catch (error : any) {
    throw error
  }
}

export const addRssFeed = async (rssFeedSource: string) => {
  try {
    const response = await postRequest({
      path: BASE_PATH, 
      options: {
        body: JSON.stringify({ source: rssFeedSource })
      }
    })

    const rss = await response.json()

    return rss
  } catch (error: any) {
    throw error
  }
}

export const deleteRssFeed = async (id : string) => {
  try {
    await deleteRequest({path: `${BASE_PATH}/${id}`})
  }  catch (error: any) {
    throw error
  }
}