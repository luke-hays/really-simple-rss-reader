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

  async get(key : string) {
    return await this.#client?.get(key)
  }

  async set(key : string, value : string, options : {[key : string]: number | string | boolean}) {
    return await this.#client?.set(key, value, options)
  }

  async delete(key : string) {
    await this.#client?.del(key)
  }
}