class SelectedFeedError extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'})

    const style = document.createElement('link')
    style.setAttribute('rel', 'stylesheet')
    style.setAttribute('href', '../../styles/components/selected-feed-error.css')

    shadow.appendChild(style)
    
    const container = document.createElement('div')
    const errorMessage = document.createElement('p')

    container.appendChild(errorMessage)

    container.classList.add('selected-feed__items--error')
    errorMessage.textContent = 'It looks like something went wrong. Please refresh and try again.'

    shadow.appendChild(container)
  }
}

customElements.define('selected-feed-error', SelectedFeedError)