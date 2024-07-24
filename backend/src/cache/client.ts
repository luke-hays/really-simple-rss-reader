import {createClient} from 'redis'

export class CacheClient {
  #client: ReturnType<typeof createClient> | null

  constructor() {
    this.#client = null
  }

  async init() {
    this.#client = await createClient({url: 'redis://redis:6379'})
      .on('error', err => console.log('Redis Client Error', err))
      .connect()
  }
}