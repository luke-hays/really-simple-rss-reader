import {getRssFeedList, addRssFeed} from './api/rss'

const buildFeedMenu = (title : string) => {
  const menu = document.querySelector('.feed-menu')
  const accordion = document.createElement('custom-accordion')
  const accordionTitle = document.createElement('div')
  const accordionContent = document.createElement('div')

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

  const addFeedForm = document.createElement('form')
  const addFeedContainer = document.createElement('div')
  const addFeedButton = document.createElement('button')
  const addFeedInput = document.createElement('input')

  addFeedForm.classList.add('add-feed__form')
  addFeedContainer.classList.add('add-feed__container')
  addFeedInput.classList.add('add-feed__input')
  addFeedButton.classList.add('add-feed__button')

  addFeedContainer.appendChild(addFeedInput)
  addFeedContainer.appendChild(addFeedButton)
  addFeedForm.appendChild(addFeedContainer)
  accordionContent.appendChild(addFeedForm)

  addFeedInput.placeholder = 'https://example.rss.com'
  addFeedInput.name = 'rss-url'
  addFeedInput.type = 'url'
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

    const spinner = document.createElement('custom-spinner')
    spinner.setAttribute('size', 'tiny')

    try {
      addFeedButton.textContent = ''
      addFeedButton.appendChild(spinner)
      addFeedButton.disabled = true
      addFeedButton.classList.add('disabled')

      const response = await addRssFeed(url.toString())

      console.log(response)

      addFeedInput.value = ''
    } catch {
      console.log('Error adding feed - need to implement')
    } finally {
      addFeedButton.textContent = 'Add Feed'
      addFeedButton.disabled = false
      addFeedButton.classList.remove('disabled')
    }
  }
  
  return accordion
}

const feedMenu = buildFeedMenu('Click here to get started.')

const populateRssFeedList = async () => {
  const selectedFeed = document.getElementById('selected-feed') as HTMLDivElement
  const selectedFeedEmpty = document.createElement('selected-feed-empty')

  const spinner = document.createElement('custom-spinner')
  
  selectedFeed.appendChild(spinner)
  selectedFeed.classList.add('selected-feed__pending')

  try {
    // Fetch a collection of RSS Feeds from a backend service - this should be changed to one
    const rssList = await getRssFeedList()
    console.log(rssList)

    if (rssList.length === 0) {
      selectedFeed.appendChild(selectedFeedEmpty)
    } else {
      // At this point, just use the first as the default
      const defaultRssFeed = rssList[0]
      feedMenu.setAttribute('data-title', defaultRssFeed.title)

      if (defaultRssFeed.items.length === 0) {
        selectedFeed.appendChild(selectedFeedEmpty)
      } else {
        // Iterate over items, render in the Selected Feed List
        const itemContainer = document.createElement('div')

        const items = defaultRssFeed.items.map(item => {
          const listItem = document.createElement('li')
          const listItemLink = document.createElement('a')
          
          listItem.appendChild(listItemLink)
          listItemLink.setAttribute('href', item.source)
          listItemLink.textContent = item.title

          return listItem
        })
        
        itemContainer.replaceChildren(...items)
        selectedFeed.appendChild(itemContainer)
      }
    }
  } catch {
    console.error('Unable to populate RSS Feed')
    const selectedFeedError = document.createElement('selected-feed-error')
    selectedFeed.appendChild(selectedFeedError)
  } finally {
    selectedFeed.removeChild(spinner)
    selectedFeed.classList.remove('selected-feed__pending')
  }
}

populateRssFeedList()