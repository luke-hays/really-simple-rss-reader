class SelectedFeedError extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'})

    const styleSheet = new CSSStyleSheet()
    styleSheet.replaceSync(`
      .selected-feed__items--error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem 1rem;
        height: 100%;
        text-align: center;
      }

      .selected-feed__items--error p {
        margin: 0;
      }
    `)

    shadow.adoptedStyleSheets = [styleSheet]
    
    const container = document.createElement('div')
    const errorMessage = document.createElement('p')

    container.appendChild(errorMessage)

    container.classList.add('selected-feed__items--error')
    errorMessage.textContent = 'It looks like something went wrong. Please refresh and try again.'

    shadow.appendChild(container)
  }
}

customElements.define('selected-feed-error', SelectedFeedError)