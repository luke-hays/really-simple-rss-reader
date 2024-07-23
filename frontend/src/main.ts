import {getRssFeedList, getRssFeed, addRssFeed} from './api/rss'
import {appendSpinner, removeSpinner, appendError, appendEmptyFeed} from './tools'

const selectedFeed = document.getElementById('selected-feed') as HTMLDivElement
selectedFeed.classList.add('selected-feed')

const buildFeedMenu = (title : string) => {
  const menu = document.querySelector('.feed-menu')
  const accordion = document.createElement('custom-accordion')
  const accordionTitle = document.createElement('div')
  const accordionContent = document.createElement('div')

  accordion.id = 'rss-accordion'
  accordionTitle.setAttribute('slot', 'accordion-trigger')
  accordionContent.setAttribute('slot', 'accordion-content')

  menu?.appendChild(accordion)
  accordion.appendChild(accordionTitle)
  accordion.appendChild(accordionContent)

  const titleElement = document.createElement('h2')
  titleElement.textContent = title

  accordionTitle.appendChild(titleElement)

  const feedList = document.createElement('ul')
  feedList.id = 'rss-options'
  feedList.classList.add('feed-list')

  accordionContent.appendChild(feedList)
 
  const addFeedForm = document.createElement('form')
  const addFeedContainer = document.createElement('div')
  const addFeedButton = document.createElement('button')
  const addFeedInput = document.createElement('input')
  const addFeedInputContainer = document.createElement('div')

  addFeedForm.classList.add('add-feed__form')
  addFeedContainer.classList.add('add-feed__container')
  addFeedInputContainer.classList.add('add-feed__input-container')
  addFeedInput.classList.add('add-feed__input')
  addFeedButton.classList.add('add-feed__button')

  addFeedInputContainer.appendChild(addFeedInput)
  addFeedInputContainer.appendChild(addFeedButton)
  addFeedContainer.appendChild(addFeedInputContainer)

  addFeedForm.appendChild(addFeedContainer)
  accordionContent.appendChild(addFeedForm)

  addFeedInput.placeholder = 'https://example.rss.com'
  addFeedInput.name = 'rss-url'
  addFeedInput.type = 'url'
  addFeedInput.required = true
  addFeedButton.textContent = 'Add Feed'

  addFeedForm.onsubmit = async (e) => {
    e.preventDefault()

    const form = document.querySelector('.add-feed__form') as HTMLFormElement

    if (form == null) {
      return
    }

    const formData = new FormData(form)
    const url = formData.get('rss-url')
    
    if (url == null) {
      return
    }

    try {
      addFeedButton.textContent = ''
      addFeedButton.disabled = true
      addFeedButton.classList.add('disabled')
      appendSpinner(addFeedButton, {size: 'tiny'})

      const error = document.getElementById('add-feed-error')

      if (error) {
        error.remove()
      }

      const response = await addRssFeed(url.toString()) as RssFeedList

      const newFeedItem = document.createElement('li')
      const newFeedItemButton = document.createElement('button')
      newFeedItemButton.classList.add('feed-item')

      newFeedItemButton.textContent = response.title
      newFeedItemButton.setAttribute('data-source', response.source)
      newFeedItem.classList.add('feed-item')

      newFeedItem.appendChild(newFeedItemButton)
      feedList.appendChild(newFeedItem)

      const items = addSelectedFeedItems(response.items)

      selectedFeed.replaceChildren(items)

      addFeedInput.value = ''
      feedMenu?.setAttribute('data-title', response.title)
    } catch {
      appendError(addFeedContainer, 'add-feed-error')
    } finally {
      addFeedButton.textContent = 'Add Feed'
      addFeedButton.disabled = false
      addFeedButton.classList.remove('disabled')
      removeSpinner(addFeedButton)
    }
  }
  
  return accordion
}

const feedMenu = buildFeedMenu('Click here to get started.')

const addSelectedFeedItems = (rssFeed : Array<RssFeed>) => {
  // Iterate over items, render in the Selected Feed List
  const itemContainer = document.createElement('ul')

  const items = rssFeed.map(item => {
    const listItem = document.createElement('li')
    const listItemLink = document.createElement('a')
    const container = document.createElement('div')

    listItem.appendChild(listItemLink)
    listItemLink.appendChild(container)

    listItemLink.href = item.source
    listItemLink.target = '_blank'
    listItemLink.rel = 'noopener noreferrer'
    listItemLink.classList.add('feed-item__link')

    container.textContent = item.title
    container.classList.add('feed-item__link-container')

    return listItem
  })
  
  itemContainer.replaceChildren(...items)

  return itemContainer
}

const addRssOptions = (items: Array<RssFeed>) => {
  const rssOptions = document.getElementById('rss-options')

  items.forEach(item => {
    const rssOption = document.createElement('li')
    const rssOptionControl = document.createElement('button')

    rssOptionControl.onclick = async () => {
      const items = await getRssFeed(item._id)
      const itemsList = addSelectedFeedItems(items)
      selectedFeed.replaceChildren(itemsList) 
      feedMenu?.setAttribute('data-title', item.title)

    }

    rssOption.classList.add('feed-item')

    rssOptionControl.textContent = item.title

    rssOption.appendChild(rssOptionControl)
    rssOptions?.appendChild(rssOption)
  })
}

const populateRssMenuOptions = async () => {
  appendSpinner(selectedFeed)
    
  try {
    // Fetch a collection of RSS Feeds from a backend service - this should be changed to one
    const rssList = await getRssFeedList()

    if (rssList.length === 0) {
      appendEmptyFeed(selectedFeed)
    } else {
      addRssOptions(rssList)
      // At this point, just use the first as the default
      const defaultRssFeed = rssList[0]
      const items = await getRssFeed(defaultRssFeed._id)

      feedMenu?.setAttribute('data-title', defaultRssFeed.title)

      if (items.length === 0) {
        appendEmptyFeed(selectedFeed)
      } else {
        const itemsList = addSelectedFeedItems(items)
        selectedFeed.appendChild(itemsList)
      }
    }
  } catch {
    appendError(selectedFeed, 'selected-feed-error')
  } finally {
    removeSpinner(selectedFeed)
  }
}

populateRssMenuOptions()