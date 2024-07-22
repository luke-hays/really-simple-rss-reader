class Spinner extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'})

    const styleSheet = new CSSStyleSheet()
    styleSheet.replaceSync(`
      .lds-ring,
      .lds-ring div {
        box-sizing: border-box;
      }
      .lds-ring {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
      }
      .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 64px;
        height: 64px;
        margin: 8px;
        border: 8px solid currentColor;
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