import { Router } from 'express'
import rss from './rss.js'

interface RouterParams {
  path: string,
  route: Router
}

const addRoute = ({path, route} : RouterParams) => ({path, route})

const routes = [
  addRoute({path: '/rss', route: rss})
]

export default routes