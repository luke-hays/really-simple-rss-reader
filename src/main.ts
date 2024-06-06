import {getFeed} from "./feed";
import RssFeed from "./models/RssFeed";
import CustomAccordion from "./accordion"

const generateRssFeedElement = (rssFeed : RssFeed) => {
  const newRssFeed = document.createElement('li')

  // Need to map each item into a list
  if (rssFeed.items.length > 0) {
    const rssFeedItemsList = document.createElement('ul')

    rssFeedItemsList.classList.add('rss-feed__items-list')

    rssFeed.items.forEach(item => {
      const rssFeedItemListContainer = document.createElement('li')
      const rssFeedItemContent = document.createElement('div')
      rssFeedItemContent.classList.add('rss-feed__list-item-content')

      const {title, link} = item
      const rssFeedItemTitle = document.createElement('a')
      const rssFeedItemDescription = document.createElement('div')
      rssFeedItemTitle.textContent = title
      rssFeedItemTitle.setAttribute('href', link)
      
      rssFeedItemContent.appendChild(rssFeedItemTitle)
      rssFeedItemContent.appendChild(rssFeedItemDescription)

      rssFeedItemListContainer.appendChild(rssFeedItemContent)
      rssFeedItemsList.appendChild(rssFeedItemListContainer)
    })

    const accordion  = new CustomAccordion(rssFeed.title, rssFeedItemsList, false)
    newRssFeed.appendChild(accordion.accordion)
  }

  return newRssFeed
}

// Get a list of feeds

const rssFeeds = await getFeed('')

const rssFeedList = document.querySelector('.rss-feed__list')

// For each feed append one of these accordion elements

rssFeeds.forEach(schema => {
  const rssFeed = new RssFeed(schema)
  const newRssElement = generateRssFeedElement(rssFeed)
  rssFeedList?.appendChild(newRssElement)
})