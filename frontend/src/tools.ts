import { getRssFeed, deleteRssFeed } from "./api/rss"

export const appendSpinner = (parent : HTMLElement, config? : {[key: string]: string}) => {
  const spinner = document.createElement('custom-spinner')

  // Custom spinner can be modified via attributes
  if (config) {
    Object.entries(config).forEach(([key, val]) => {
      spinner.setAttribute(key, val)
    })
  }

  parent.classList.add('pending')
  parent.appendChild(spinner)
}

export const removeSpinner = (parent : HTMLElement) => {
  const spinner = parent.querySelector('custom-spinner')
  if (spinner) {
    parent.removeChild(spinner)}
    parent.classList.remove('pending')
}

export const appendError = (parent : HTMLElement, customElementName: string) => {
  console.error('Unable to populate RSS Feed')

  const error = document.createElement(customElementName)
  error.id = customElementName

  parent.appendChild(error)
}

export const appendEmptyFeed = (parent : HTMLElement) => {
  parent.appendChild(document.createElement('selected-feed-empty'))
}

export const addSelectedFeedItems = (parent : HTMLElement, items : Array<RssFeed>) => {
  // Iterate over items, render in the Selected Feed List
  const itemContainer = document.createElement('ul')

  const articles = items.map(item => {
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
  
  itemContainer.replaceChildren(...articles)
  parent.replaceChildren(itemContainer)
}

export const createRssOption = (rssMenu : HTMLElement, selectedFeed : HTMLElement, item : RssFeed) => {
  const rssOption = document.createElement('li')
  const rssOptionContainer = document.createElement('div')
  const rssOptionControl = document.createElement('button')
  const rssDeleteButton = document.createElement('button')

  rssOption.id = item._id
  rssOption.classList.add('feed-item')
  rssOptionContainer.classList.add('rss-option')

  /* Set selected feed */
  rssOptionControl.classList.add('rss-set-option')
  rssOptionControl.textContent = item.title
  rssOptionControl.setAttribute('data-source', item.source)

  rssOptionControl.onclick = async () => {
    const items = await getRssFeed(item._id)
    addSelectedFeedItems(selectedFeed, items)
    rssMenu.setAttribute('data-title', item.title)
  }

  /* Delete */
  const rssDeleteButtonIcon = document.createElement('img')
  rssDeleteButtonIcon.src = 'trash-solid.svg'
  rssDeleteButtonIcon.classList.add('rss-delete-option__icon')

  rssDeleteButton.classList.add('rss-delete-option')
  rssDeleteButton.appendChild(rssDeleteButtonIcon)

  // In the interest of time, not bothering with extracting modal code elsewhere
  rssDeleteButton.onclick = () => {
    const overlay = document.getElementById('overlay')

    if (overlay == null) return

    const removeModal = () => {
      overlay.setAttribute('hidden', 'true')
      const modal = document.getElementById('modal')
      if (modal) {
        document.body.removeChild(modal)
      }
    }

    overlay.removeAttribute('hidden')
    overlay.onclick = removeModal

    const modal = document.createElement('div')
    const modalContainer = document.createElement('div')
    const messageBody = document.createElement('div')
    const controls = document.createElement('div')
    const warning = document.createElement('p')
    const confirm = document.createElement('button')
    const cancel = document.createElement('button')

    modal.id = 'modal'
    modal.classList.add('modal')
    modalContainer.classList.add('modal__container')
    controls.classList.add('modal__controls')
    messageBody.classList.add('modal__body')
    confirm.classList.add('modal__confirm', 'critical')
    cancel.classList.add('modal__cancel')
  
    warning.textContent = `Are you sure you want to delete ${item.title}?`
    confirm.textContent = 'Delete'
    cancel.textContent = 'Cancel'

    cancel.onclick = removeModal

    confirm.onclick = async () => {
      try {
        const errorMessage = document.getElementById('delete-error')
        if (errorMessage) errorMessage.remove()
        
        cancel.disabled = true
        confirm.disabled = true

        await deleteRssFeed(item._id)

        // Remove from options if successful
        const option = document.getElementById(item._id)
        option?.remove()
      } catch {
        const errorContainer = document.createElement('p')
        errorContainer.id = 'delete-error'
        errorContainer.textContent = 'Failed to delete RSS feed. Please try again.'
        messageBody.appendChild(errorContainer)
      } finally {
        confirm.disabled = false
        cancel.disabled = false
        removeModal()
      }
    }

    messageBody.appendChild(warning)
    modalContainer.append(messageBody, controls)
    controls.append(cancel, confirm)
    modal.appendChild(modalContainer)

    document.body.appendChild(modal)
  }

  rssOptionContainer.appendChild(rssOptionControl)
  rssOptionContainer.appendChild(rssDeleteButton)
  rssOption.appendChild(rssOptionContainer)

  return rssOption
}