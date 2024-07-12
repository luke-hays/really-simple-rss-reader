import { getRequest } from "./api";

export const getRssFeed = async () => {
  const response = await getRequest({path: 'rss'})
  return response
}