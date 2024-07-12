// import { getAllRssFeeds } from "./db/rss-db"
import CustomAccordion from "./components/accordion"
import {getRssFeed} from './api/rss'

// // const generateRssFeedElement = (rssFeed : RssFeed) => {
// //   // const newRssFeed = document.createElement('li')

// //   // // Need to map each item into a list
// //   // if (rssFeed.items.length > 0) {
// //   //   const rssFeedItemsList = document.createElement('ul')

// //   //   rssFeedItemsList.classList.add('rss-feed__items-list')

// //   //   rssFeed.items.forEach(item => {
// //   //     const rssFeedItemListContainer = document.createElement('li')
// //   //     const rssFeedItemContent = document.createElement('div')
// //   //     rssFeedItemContent.classList.add('rss-feed__list-item-content')

// //   //     const {title, link} = item
// //   //     const rssFeedItemTitle = document.createElement('a')
// //   //     const rssFeedItemDescription = document.createElement('div')
// //   //     rssFeedItemTitle.textContent = title
// //   //     rssFeedItemTitle.setAttribute('href', link)
      
// //   //     rssFeedItemContent.appendChild(rssFeedItemTitle)
// //   //     rssFeedItemContent.appendChild(rssFeedItemDescription)

// //   //     rssFeedItemListContainer.appendChild(rssFeedItemContent)
// //   //     rssFeedItemsList.appendChild(rssFeedItemListContainer)
// //   //   })

// //   //   const accordion  = new CustomAccordion(rssFeed.title, rssFeedItemsList, false)
// //   //   newRssFeed.appendChild(accordion.accordion)
// //   // }

// //   // return newRssFeed
// // }

// const getFeed = async (url : Api['getRequest']['url']) => {
//   const feedData = await getRequest({url});
//   const text = await feedData.text();
//   return text
// }


const populateRssFeedList = async () => {
  // Fetch a collection of RSS Feeds from a backend service
  // Right now this will just be one
  const rssFeed = await getRssFeed()

  // Need to handle possible undefined or null values
  if (rssFeed == null) return

  const rssFeedList = [rssFeed]
  
  // Grab the element responsible for rendering the list of feeds
  const rssContainer = document.querySelector('.rss-feed__list')

  // Loop through and append to the main list on the page
  rssFeedList.forEach(async feed => {
    const rss = document.createElement('li')
    const rssItems = document.createElement('ul')

    rss.classList.add('rss-feed__items-list')

    const rssAccordion = new CustomAccordion(feed.title, rssItems, false)
    
    rss.appendChild(rssAccordion.accordion)
    rssContainer?.appendChild(rss)
  })
}

await populateRssFeedList()
