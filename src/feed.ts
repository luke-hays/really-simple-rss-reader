import {getRequest} from "./api/api";
import rss from './hackernews';

export const getFeed = async (url : Api['getRequest']['url']) => {
    // const feedData = await getRequest({url});
    // console.log(feedData)
    // const text = await feedData.text();
    const parser = new DOMParser()
    const parsed_text = parser.parseFromString(rss, 'application/xhtml+xml')
    // console.log(parsed_text.querySelectorAll('item'))
    return parsed_text
}