class AddFeedError extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'})

    const styleSheet = new CSSStyleSheet()
    styleSheet.replaceSync(`
      .add-feed__error-message {
        color: white;
      }
    `)

    shadow.adoptedStyleSheets = [styleSheet]
    
    const errorContainer = document.createElement('div')
    const errorMessage = document.createElement('p')

    errorMessage.classList.add('add-feed__error-message')
    errorMessage.textContent = 'It looks like there was an error adding the feed.'

    errorContainer.appendChild(errorMessage)
    shadow.appendChild(errorContainer)
  }
}

customElements.define('add-feed-error', AddFeedError)