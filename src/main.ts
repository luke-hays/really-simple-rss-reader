import {getFeed} from "./feed";

const feed = await getFeed('')

const feedTitle = feed.querySelector('title')?.innerHTML
const feedLink = feed.querySelector('link')
const feedDescription = feed.querySelector('description')

console.log(feedTitle)

const rssFeedList = document.querySelector('.rss-feed__list')


const newFeed = document.createElement('li')
const accordionHeader = document.createElement('h4')
const accordionTrigger = document.createElement('button')
const accordionPanel = document.createElement('div')

accordionHeader.classList.add('accordion-header')
accordionTrigger.classList.add('accordion-trigger')
accordionTrigger.id = `${feedTitle}-accordion`
accordionTrigger.setAttribute('aria-expanded', "false")
accordionTrigger.setAttribute('aria-controls', feedTitle)
accordionTrigger.innerText = 'trigger'

accordionPanel.classList.add('accordion-panel')
accordionPanel.id = feedTitle
accordionPanel.setAttribute('aria-expanded', "false")
accordionPanel.setAttribute('aria-labelledby', `${feedTitle}-accordion`)
accordionPanel.toggleAttribute('hidden')
accordionPanel.innerText = 'info'

accordionHeader.appendChild(accordionTrigger)
newFeed.appendChild(accordionHeader)
newFeed.appendChild(accordionPanel)

rssFeedList?.appendChild(newFeed)

console.log(rssFeedList)


const accordionTriggers = document.querySelectorAll('.accordion-trigger')

accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const accordionPanelId = trigger.getAttribute('aria-controls')

        if (!accordionPanelId) {
            console.error('Error: assign aria-controls on accordion trigger')
            return
        }

        const accordionPanel = document.getElementById(accordionPanelId)

        if (!accordionPanel) {
            console.error(`Error: aria-controls for ${accordionPanelId} should have corresponding panel`)
            return
        }

        const expanded = trigger.getAttribute('aria-expanded') === 'true'

        accordionPanel.toggleAttribute('hidden', expanded)
        trigger.setAttribute('aria-expanded', (!expanded).toString())
    })
})
