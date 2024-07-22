import {getRssFeedList, addRssFeed} from './api/rss'

// Grab the element responsible for rendering the list of feeds
const rssAccordionList = document.querySelector('.rss-feed__list')

const buildFeedMenu = (title : string) => {
  const menu = document.querySelector('.feed-menu')
  const accordion = document.createElement('custom-accordion')
  const accordionTitle = document.createElement('div')
  const accordionContent = document.createElement('div')

  accordion.setAttribute('stylesheet', '../styles/components/accordion.css')
  accordionTitle.setAttribute('slot', 'accordion-trigger')
  accordionContent.setAttribute('slot', 'accordion-content')

  menu?.appendChild(accordion)
  accordion.appendChild(accordionTitle)
  accordion.appendChild(accordionContent)

  const titleElement = document.createElement('h2')
  titleElement.textContent = title

  accordionTitle.appendChild(titleElement)

  const feedList = document.createElement('ul')
  const feedItem = document.createElement('li')

  const feedItemContent = document.createElement('div')
  const feedItemTitle = document.createElement('button')

  feedList.classList.add('feed-list')
  feedItem.classList.add('feed-item')

  accordionContent.appendChild(feedList)
  feedItem.appendChild(feedItemContent)
  feedItemContent.appendChild(feedItemTitle)
  
  feedItemTitle.textContent = 'Sample NASA RSS Feed'

  feedList.appendChild(feedItem)

  feedList.appendChild(feedItem.cloneNode(true))
  feedList.appendChild(feedItem.cloneNode(true))
  feedList.appendChild(feedItem.cloneNode(true))
  feedList.appendChild(feedItem.cloneNode(true))
  feedList.appendChild(feedItem.cloneNode(true))
}

buildFeedMenu('Feed Title')

// If this is removed, just crash the page.
// Ideally we would sound an alarm immediately in an actual prod environment
if (rssAccordionList == null) throw new Error('Unable to build RSS list')


const buildRssAccordion = (feed : RssFeedList) => {
  const rssAccordionListElement = document.createElement('li')
  const rssAccordion = document.createElement('custom-accordion')
  const rssAccordionTitle = document.createElement('div')
  const rssAccordionContent = document.createElement('ul')

  // Title and Content of accordion is dynamic
  rssAccordionTitle.setAttribute('slot', 'accordion-trigger')
  rssAccordionContent.setAttribute('slot', 'accordion-content')

  rssAccordion.appendChild(rssAccordionTitle)
  rssAccordion.appendChild(rssAccordionContent)
  rssAccordionListElement.appendChild(rssAccordion)

  rssAccordionListElement.classList.add('rss-feed__items-list')
  rssAccordionTitle.textContent = feed.title

  // For item in each feed we need to render a list of items
  feed.items.forEach(item => {
    const itemListElement = document.createElement('li')
    const itemTitle = document.createElement('a')
    const itemContent = document.createElement('div')
    const itemDescription = document.createElement('div')

    itemListElement.appendChild(itemContent)
    itemContent.appendChild(itemTitle)
    itemContent.appendChild(itemDescription)
    rssAccordionContent.appendChild(itemListElement)

    const {title, source} = item

    itemContent.classList.add('rss-feed__list-item-content')
    itemTitle.textContent = title
    itemTitle.setAttribute('href', source)
  })

  return rssAccordionListElement
}

const populateRssFeedList = async () => {
  // Fetch a collection of RSS Feeds from a backend service
  // Right now this will just be one
  const rssList = await getRssFeedList()

  // Need to handle possible undefined or null values
  if (rssList == null) return

  // Loop through and append to the main list on the page
  rssList.forEach(async feed => {
    const accordion = buildRssAccordion(feed)
    rssAccordionList.appendChild(accordion)
  })
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

  try {
    const newRssFeed = await addRssFeed(url)

    if (newRssFeed == null) throw new Error('handle later')

    const newRssAccordion = buildRssAccordion(newRssFeed)

    rssAccordionList.appendChild(newRssAccordion)

    input.value = '' // TODO Need to clear this in more states
  } catch (error: any) {
    console.error(error) // TODO Error state
  }
}

await populateRssFeedList()

const addRssFeedButton = document.querySelector('#add-feed-button')
addRssFeedButton?.addEventListener('click', addFeed)