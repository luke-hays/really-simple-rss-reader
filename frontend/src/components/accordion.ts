// Spec according to W3 for practice
// Also testing out using web components with native API
class CustomAccordion extends HTMLElement {
  constructor() {
    super()
  }
  
  // Define all functionality that element will have when connected to DOM
  // Element attributes are not available in constructor, so need to be set up here
  connectedCallback() {
    // Create the shadow root, the custom element itself is the shadow host
    const shadow = this.attachShadow({mode: 'open'})

    const accordion = document.createElement('div')
    const header = document.createElement('h4')
    const trigger = document.createElement('button')
    const content =  document.createElement('div')

    shadow.appendChild(accordion)
    header.appendChild(trigger)
    accordion.appendChild(header)
    accordion.appendChild(content)

    const id = crypto.randomUUID()

    // Header
    header.classList.add('class', 'accordion-header')

    // Trigger
    trigger.classList.add('class', 'accordion-trigger')
    trigger.id = `${id}-accordion-trigger`
    trigger.setAttribute('aria-controls', id)
    trigger.setAttribute('aria-expanded', 'true')
    trigger.innerHTML = `<slot name="accordion-trigger">Expand</slot>` // Slot is used for dynamic content

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
  }
}

// Custom element needs to be registered
customElements.define('custom-accordion', CustomAccordion)