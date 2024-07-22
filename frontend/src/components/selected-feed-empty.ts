class SelectedFeedEmpty extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'})

    const styleSheet = new CSSStyleSheet()
    styleSheet.replaceSync(`
        .selected-feed__items--empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem 1rem;
        height: 100%;
        text-align: center;
      }

      .selected-feed__items--empty p {
        margin: 0;
      }

      #smile-icon {
        height: 24px;
      }
    `)

    shadow.adoptedStyleSheets = [styleSheet]

    const container = document.createElement('div')
    const text1 = document.createElement('p')
    const text2 = document.createElement('p')
    const icon = document.createElement('img')

    container.classList.add('selected-feed__items--empty')
    text1.textContent = "It looks like you don't either don't currently have any feeds selected or your feed is empty."
    text2.textContent = 'Please add an RSS Feed to get started!'
    icon.setAttribute('src', 'face-smile-regular.svg')
    icon.setAttribute('id', 'smile-icon')

    container.appendChild(text1)
    container.appendChild(text2)
    container.appendChild(icon)

    shadow.appendChild(container)
  }
}

customElements.define('selected-feed-empty', SelectedFeedEmpty)

// const container = document.createElement('div')
// container.classList.add('selected-feed__items--empty')

// container.innerHTML = `
//   <div class="selected-feed__items--empty">
//     <p>It looks like you don't currently have any feeds.</p>
//     <p>Please add an RSS Feed to get started!</p>
//     <img src="face-smile-regular.svg" id="smile-icon"/>
//   </div>
// `

// shadow.appendChild(container)