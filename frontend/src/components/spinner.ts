class Spinner extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'})

    const style = document.createElement('link')
    style.setAttribute('rel', 'stylesheet')
    style.setAttribute('href', '../../styles/components/spinner.css')

    const spinner = document.createElement('div')
    spinner.classList.add('lds-ring')
    spinner.innerHTML = '<div></div><div></div><div></div><div></div>'

    shadow.appendChild(style)
    shadow.appendChild(spinner)
  }
}

customElements.define('custom-spinner', Spinner)