// Spec according to W3 for practice
// This may be transformed to a web component - for right now just rely on styling outside
// TODO Look at web component feasability
export default class CustomAccordion {
  triggerContent : string | Node
  panelContent : string | Node
  hidden? : boolean = true // Collapsed would be a more a more appropriate term
  accordion : HTMLDivElement = document.createElement('div')

  #id : string
  #header : HTMLHeadingElement = document.createElement('h4')
  #trigger : HTMLButtonElement = document.createElement('button')
  #panel : HTMLDivElement = document.createElement('div')

  constructor(
    triggerContent : string | Node, 
    panelContent: string | Node, 
    hidden? : boolean
  ) {
    this.#id = crypto.randomUUID()
    this.triggerContent = triggerContent
    this.panelContent = panelContent
    this.hidden = hidden

    console.log(panelContent)

    this
      .#createHeader()
      .#createTrigger()
      .#createPanel()

    return this
  }

  #createHeader() {
    this.#header.classList.add('accordion-header')
    this.accordion.appendChild(this.#header)

    return this
  }

  #createTrigger() {
    this.#trigger.classList.add('accordion-trigger')
    this.#trigger.id = `${this.#id}-accordion`
    this.#trigger.setAttribute('aria-controls', this.#id)
    this.#trigger.setAttribute('aria-expanded', "true")

    // Uncaught TypeError TypeError: Cannot read private member #panel from an object whose class did not declare it
    // Probably due to passing it in as an event handler, bind this to properly call
    this.#trigger.addEventListener('click', this.#toggleExpanded.bind(this))

    if (typeof this.triggerContent === 'string') {
      this.#trigger.textContent = this.triggerContent
    } else {
      this.#trigger.appendChild(this.triggerContent)
    }

    if (this.hidden) {
      this.#trigger.setAttribute('aria-expanded', "false")
    }

    this.#header.appendChild(this.#trigger)

    return this
  }

  #createPanel() {
    this.#panel.classList.add('accordion-panel')
    this.#panel.id = this.#id
    this.#panel.setAttribute('aria-expanded', "true")
    this.#panel.setAttribute('aria-labelledby', `${this.#id}-accordion`)

    if (typeof this.panelContent === 'string') {
      this.#panel.textContent = this.panelContent
    } else {
      this.#panel.appendChild(this.panelContent)
    }

    if (this.hidden) {
      this.#panel.setAttribute('aria-expanded', "false")
      this.#panel.toggleAttribute('hidden')
    }

    this.accordion.appendChild(this.#panel)
  
    return this
  }

  #toggleExpanded() {
    this.hidden = !this.hidden

    const expanded = Boolean(!this.hidden).toString()

    this.#panel.setAttribute('aria-expanded', expanded)
    this.#trigger.setAttribute('aria-expanded', expanded)
    this.#panel.toggleAttribute('hidden')
  }
}