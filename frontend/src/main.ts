import {getRssOptions, getRssFeed, addRssFeed} from './api/rss'
import {
  appendSpinner, 
  removeSpinner, 
  appendError, 
  appendEmptyFeed, 
  addSelectedFeedItems,
  createRssOption
} from './tools'

const selectedFeed = document.getElementById('selected-feed') as HTMLDivElement
selectedFeed.classList.add('selected-feed')

const buildAddRssForm = (rssOptions : HTMLElement) => {
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

      const newRssOption = createRssOption(rssOptionsMenu, selectedFeed, response)

      rssOptions.appendChild(newRssOption)

      addSelectedFeedItems(selectedFeed, response.items)

      addFeedInput.value = ''
      rssOptionsMenu?.setAttribute('data-title', response.title)
    } catch {
      appendError(addFeedContainer, 'add-feed-error')
    } finally {
      addFeedButton.textContent = 'Add Feed'
      addFeedButton.disabled = false
      addFeedButton.classList.remove('disabled')
      removeSpinner(addFeedButton)
    }
  }

  return addFeedForm
}

const buildRssOptionsMenu = (title : string) => {
  const menu = document.querySelector('.feed-menu')
  const accordion = document.createElement('custom-accordion')
  const accordionTitle = document.createElement('div')
  const accordionContent = document.createElement('div')

  accordion.id = 'rss-accordion'
  accordionTitle.setAttribute('slot', 'accordion-trigger')
  accordionContent.setAttribute('slot', 'accordion-content')

  if (menu == null) throw new Error()

  menu.appendChild(accordion)
  accordion.appendChild(accordionTitle)
  accordion.appendChild(accordionContent)

  const titleElement = document.createElement('h2')
  titleElement.textContent = title

  accordionTitle.appendChild(titleElement)

  const rssOptions = document.createElement('ul')
  rssOptions.id = 'rss-options'
  rssOptions.classList.add('feed-list')

  const form = buildAddRssForm(rssOptions)

  accordionContent.appendChild(rssOptions)
  accordionContent.appendChild(form)

  return accordion
}

const addRssOptions = (items: Array<RssFeed>) => {
  const rssOptions = document.getElementById('rss-options')

  if (rssOptions == null) throw new Error()

  items.forEach(item => {
    const rssOption = createRssOption(rssOptionsMenu, selectedFeed, item)
    rssOptions.appendChild(rssOption)
  })
}

const getRssMenuOptions = async () => {
  appendSpinner(selectedFeed)
    
  try {
    // Fetch a collection of RSS Feeds from a backend service - this should be changed to one
    const rssOptions = await getRssOptions()

    if (rssOptions.length === 0) {
      appendEmptyFeed(selectedFeed)
    } else {
      addRssOptions(rssOptions)

      // At this point, just use the first as the default
      const defaultRssOption = rssOptions[0]
      const items = await getRssFeed(defaultRssOption._id)

      rssOptionsMenu.setAttribute('data-title', defaultRssOption.title)

      if (items.length === 0) {
        appendEmptyFeed(selectedFeed)
      } else {
        addSelectedFeedItems(selectedFeed, items)
      }
    }
  } catch {
    appendError(selectedFeed, 'selected-feed-error')
  } finally {
    removeSpinner(selectedFeed)
  }
}

const rssOptionsMenu = buildRssOptionsMenu('Click here to get started.')
getRssMenuOptions()