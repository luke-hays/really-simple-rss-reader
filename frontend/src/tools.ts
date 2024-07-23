export const appendSpinner = (parent : HTMLElement, config? : {[key: string]: string}) => {
  const spinner = document.createElement('custom-spinner')

  // Custom spinner can be modified via attributes
  if (config) {
    Object.entries(config).forEach(([key, val]) => {
      spinner.setAttribute(key, val)
    })
  }

  parent.classList.add('pending')
  parent.appendChild(spinner)
}

export const removeSpinner = (parent : HTMLElement) => {
  const spinner = parent.querySelector('custom-spinner')
  if (spinner) {
    parent.removeChild(spinner)}
    parent.classList.remove('pending')
}

export const appendError = (parent : HTMLElement, customElementName: string) => {
  console.error('Unable to populate RSS Feed')

  const error = document.createElement(customElementName)
  error.id = customElementName

  parent.appendChild(error)
}

export const appendEmptyFeed = (parent : HTMLElement) => {
  parent.appendChild(document.createElement('selected-feed-empty'))
}