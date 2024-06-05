import {getFeed} from "./feed";
import RssFeed from "./models/RssFeed";

const generateAccordionTrigger = (id : string) => {
  const accordionTrigger = document.createElement('button')

  accordionTrigger.classList.add('accordion-trigger')
  accordionTrigger.id = `${id}-accordion`
  accordionTrigger.setAttribute('aria-expanded', "false")
  accordionTrigger.setAttribute('aria-controls', id)

  return accordionTrigger
}

const generateAccordionPanel = (id : string) => {
  const accordionPanel = document.createElement('div')

  accordionPanel.classList.add('accordion-panel')
  accordionPanel.id = id
  accordionPanel.setAttribute('aria-expanded', "false")
  accordionPanel.setAttribute('aria-labelledby', `${id}-accordion`)
  accordionPanel.toggleAttribute('hidden')
  
  return accordionPanel
}

const generateRssFeedElement = (rssFeed : RssFeed) => {
  const newRssFeed = document.createElement('li')

  const accordionHeader = document.createElement('h4')
  accordionHeader.classList.add('accordion-header')

  const accordionTrigger = generateAccordionTrigger(rssFeed.title)
  const accordionPanel = generateAccordionPanel(rssFeed.title)

  accordionTrigger.textContent = rssFeed.title

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

    accordionPanel.appendChild(rssFeedItemsList)
  }

  accordionHeader.appendChild(accordionTrigger)
  newRssFeed.appendChild(accordionHeader)
  newRssFeed.appendChild(accordionPanel)

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

const accordionTriggers = document.querySelectorAll('.accordion-trigger')

accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const accordionPanelId = trigger.getAttribute('aria-controls')

        if (!accordionPanelId) {
            console.error('Error: assign aria-controls on accordion trigger')
            return
        }

        const accordionPanel = document.getElementById(accordionPanelId)

        if (!accordionPanel) {
            console.error(`Error: aria-controls for ${accordionPanelId} should have corresponding panel`)
            return
        }

        const expanded = trigger.getAttribute('aria-expanded') === 'true'

        accordionPanel.toggleAttribute('hidden', expanded)
        trigger.setAttribute('aria-expanded', (!expanded).toString())
    })
})
