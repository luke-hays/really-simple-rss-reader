// Spec according to W3 for practice
// Also testing out using web components with native API
class CustomAccordion extends HTMLElement {
  static get observedAttributes() {
    return ['data-title', 'default-expand']
  }

  constructor() {
    super()
  }
  
  // Define all functionality that element will have when connected to DOM
  // Element attributes are not available in constructor, so need to be set up here
  connectedCallback() {
    // Create the shadow root, the custom element itself is the shadow host
    const shadow = this.attachShadow({mode: 'open'})

    const styleSheet = new CSSStyleSheet()
    styleSheet.replaceSync(`
      .accordion-header {
        margin: 0;
      }

      .accordion-trigger {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.125rem;
        padding: 1rem 0;
        background-color: var(--footer-interactive-color);
        color: var(--footer-button-font-color);
        position: sticky;
        top: 0;
        width: 100%;
        border: none;
        height: 4rem;
      }

      .accordion-trigger:hover {
        cursor: pointer;
      }
    `)

    shadow.adoptedStyleSheets = [styleSheet]

    const accordion = document.createElement('div')
    const header = document.createElement('h4')
    const trigger = document.createElement('button')
    const content =  document.createElement('div')

    shadow.appendChild(accordion)
    header.appendChild(trigger)
    accordion.appendChild(header)
    accordion.appendChild(content)

    const id = crypto.randomUUID()
    const title = this.getAttribute('data-title') ?? ''

    let defaultExpand = 'false'
    if (this.hasAttribute('default-expand')) {
      defaultExpand = this.getAttribute('default-expand') ?? defaultExpand
    }

    // Header
    header.classList.add('class', 'accordion-header')

    // Trigger
    trigger.classList.add('class', 'accordion-trigger')
    trigger.id = `${id}-accordion-trigger`
    trigger.setAttribute('aria-controls', id)
    trigger.setAttribute('aria-expanded', defaultExpand)
    trigger.innerHTML = `<slot name="accordion-trigger">${title}</slot>` // Slot is used for dynamic content

    trigger.addEventListener('click', () => {
      const currentlyExpanded = trigger.getAttribute('aria-expanded')
      let newExpanded = 'true'

      if (currentlyExpanded === 'true') {
        newExpanded = 'false'
      }

      content.setAttribute('aria-expanded', newExpanded)
      trigger.setAttribute('aria-expanded', newExpanded)
      content.toggleAttribute('hidden')
    })

    // Content
    content.classList.add('accordion-content')
    content.id = id
    content.setAttribute('aria-expanded', "true")
    content.setAttribute('aria-labelledby', `${id}-accordion-trigger`)
    content.innerHTML = `<slot name="accordion-content">Test</slot>` // Slot is used for dynamic content
    if (defaultExpand === 'false') content.toggleAttribute('hidden')
  }

  attributeChangedCallback(name: string, _ : string | null, newValue: string | null) {
    const shadow = this.shadowRoot
    const trigger = shadow?.querySelector('button')
        
    if (trigger != null && name === 'data-title') {
      trigger.textContent = newValue ?? ''
    }
  }
}

// Custom element needs to be registered
customElements.define('custom-accordion', CustomAccordion)