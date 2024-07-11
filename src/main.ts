import { getAllRssFeeds } from "./db/rss-db"
import CustomAccordion from "./components/accordion"
import { getRequest } from "./api/api";

// const generateRssFeedElement = (rssFeed : RssFeed) => {
//   // const newRssFeed = document.createElement('li')

//   // // Need to map each item into a list
//   // if (rssFeed.items.length > 0) {
//   //   const rssFeedItemsList = document.createElement('ul')

//   //   rssFeedItemsList.classList.add('rss-feed__items-list')

//   //   rssFeed.items.forEach(item => {
//   //     const rssFeedItemListContainer = document.createElement('li')
//   //     const rssFeedItemContent = document.createElement('div')
//   //     rssFeedItemContent.classList.add('rss-feed__list-item-content')

//   //     const {title, link} = item
//   //     const rssFeedItemTitle = document.createElement('a')
//   //     const rssFeedItemDescription = document.createElement('div')
//   //     rssFeedItemTitle.textContent = title
//   //     rssFeedItemTitle.setAttribute('href', link)
      
//   //     rssFeedItemContent.appendChild(rssFeedItemTitle)
//   //     rssFeedItemContent.appendChild(rssFeedItemDescription)

//   //     rssFeedItemListContainer.appendChild(rssFeedItemContent)
//   //     rssFeedItemsList.appendChild(rssFeedItemListContainer)
//   //   })

//   //   const accordion  = new CustomAccordion(rssFeed.title, rssFeedItemsList, false)
//   //   newRssFeed.appendChild(accordion.accordion)
//   // }

//   // return newRssFeed
// }

const getFeed = async (url : Api['getRequest']['url']) => {
  const feedData = await getRequest({url});
  const text = await feedData.text();
  return text
}

export const addFeed = async (url) => {
  const rssFeedList = document.querySelector('.rss-feed__list')

  // Need a pending setting here

  try {
    new URL(url)
  } catch {
    console.error('Invalid URL') // change to show invalid status
    return
  }

  try {
    const documentString = await getFeed(url)
    const parser = new DOMParser()
    const document = parser.parseFromString(documentString, 'application/xhtml+xml')

    if (document.querySelector('parseError')) throw new Error('error parsing document')

    // postRssFeed(document)

    // const rssFeed = new RssFeed(document)
    // const newRssElement = generateRssFeedElement(rssFeed)
    // rssFeedList?.appendChild(newRssElement)

    // input.value = ''

    return document

  } catch (error: any) {
    console.error(error)
  }
}

const populateRssFeedList = async () => {
  // Fetch RssFeeds from DB
  const rssFeeds = await getAllRssFeeds()

  const rssContainer = document.querySelector('.rss-feed__list')

  // Loop through and append to the main list on the page
  rssFeeds.forEach(async feed => {
    const rss = document.createElement('li')
    rss.classList.add('rss-feed__items-list')

    const rssItems = document.createElement('ul')
    
    // Add items to this element
    const doc = await addFeed(feed.source)
    console.log(doc)

    const rssAccordion = new CustomAccordion(feed.title, rssItems, false)
    rss.appendChild(rssAccordion.accordion)
    rssContainer?.appendChild(rss)
  })
}

await populateRssFeedList()
