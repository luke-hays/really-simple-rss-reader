import CustomAccordion from "./components/accordion"
import {getRssFeedList, addRssFeed} from './api/rss'
import RssFeedElements from "./models/RssFeed"

const generateRssFeedElement = (feed : RssFeedElements) => {
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
  return rss
}

const addFeed = async () => {
  const input = document.getElementById('rss-url-input') as HTMLInputElement

  const url = input?.value
  // TODO Pending state

  try {
    new URL(url)
  } catch {
    console.error('Invalid URL') // TODO Error state
    return
  }

  const rssFeedList = document.querySelector('.rss-feed__list')

  try {
    const newRssFeed = await addRssFeed(url)

    if (newRssFeed == null) throw new Error('handle later')

    const newRssElement = generateRssFeedElement(newRssFeed)

    rssFeedList?.appendChild(newRssElement)

    input.value = ''
  } catch (error: any) {
    console.error(error) // TODO Error state
  }
}

const populateRssFeedList = async () => {
  // Fetch a collection of RSS Feeds from a backend service
  // Right now this will just be one
  const rssFeedList = await getRssFeedList()

  // Need to handle possible undefined or null values
  if (rssFeedList == null) return
  
  // Grab the element responsible for rendering the list of feeds
  const rssContainer = document.querySelector('.rss-feed__list')

  // Loop through and append to the main list on the page
  rssFeedList.forEach(async feed => {
    const rss = generateRssFeedElement(feed)
    rssContainer?.appendChild(rss)
  })
}

await populateRssFeedList()

const addRssFeedButton = document.querySelector('#add-feed-button')
addRssFeedButton?.addEventListener('click', addFeed)