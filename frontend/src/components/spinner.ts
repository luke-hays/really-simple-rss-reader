class Spinner extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'})

    const size = this.getAttribute('size')

    let width = '80px'
    let innerWidth = '64px'
    let innerBorderSize = '8px'

    if (size === 'tiny') {
      width = '24px'
      innerWidth = '8px'
      innerBorderSize = '1px'
    }

    const styleSheet = new CSSStyleSheet()
    styleSheet.replaceSync(`
      .lds-ring,
      .lds-ring div {
        box-sizing: border-box;
      }
      .lds-ring {
        display: inline-block;
        position: relative;
        width: ${width};
        height: ${width};
      }
      .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: ${innerWidth};
        height: ${innerWidth};
        margin: 8px;
        border: ${innerBorderSize} solid currentColor;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: currentColor transparent transparent transparent;
      }
      .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
      }
      .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
      }
      .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
      }
      @keyframes lds-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `)

    shadow.adoptedStyleSheets = [styleSheet]

    const spinner = document.createElement('div')
    spinner.classList.add('lds-ring')
    spinner.innerHTML = '<div></div><div></div><div></div><div></div>'

    shadow.appendChild(spinner)
  }
}

customElements.define('custom-spinner', Spinner)