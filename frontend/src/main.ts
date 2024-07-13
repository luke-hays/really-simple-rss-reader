import CustomAccordion from "./components/accordion"
import {getRssFeed} from './api/rss'

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
    const rssList = document.createElement('ul')

    rss.classList.add('rss-feed__items-list')

    // For item in each feed we need to render a list of items
    feed.items.forEach(item => {
      // itemList is our list element that will hold a content element
      const itemList = document.createElement('li')
      const itemContent = document.createElement('div')

      itemContent.classList.add('rss-feed__list-item-content')

      const {title, source} = item
      const itemTitle = document.createElement('a')
      const itemDescription = document.createElement('div')
      
      itemTitle.textContent = title
      itemTitle.setAttribute('href', source)
      
      itemContent.appendChild(itemTitle)
      itemContent.appendChild(itemDescription)

      // We need to append the content to the new list element
      itemList.appendChild(itemContent)
      // Then append this list element to an unordered list of rss feeds
      rssList.appendChild(itemList)
    })

    const rssAccordion = new CustomAccordion(feed.title, rssList, false)
    
    rss.appendChild(rssAccordion.accordion)
    rssContainer?.appendChild(rss)
  })
}

await populateRssFeedList()


// export const addFeed = async () => {
//   const rssFeedList = document.querySelector('.rss-feed__list')

//   const input = document.getElementById('rss-url-input') as HTMLInputElement

//   const url = input?.value
//   // Need a pending setting here

//   try {
//     new URL(url)
//   } catch {
//     console.error('Invalid URL') // change to show invalid status
//     return
//   }

//   try {
//     const documentString = await getFeed(url)
//     const parser = new DOMParser()
//     const document = parser.parseFromString(documentString, 'application/xhtml+xml')

//     if (document.querySelector('parseError')) throw new Error('error parsing document')

//     postRssFeed(document)

//     const rssFeed = new RssFeed(document)
//     const newRssElement = generateRssFeedElement(rssFeed)
//     rssFeedList?.appendChild(newRssElement)

//     input.value = ''

//   } catch (error: any) {
//     console.error(error)
//   }
// }