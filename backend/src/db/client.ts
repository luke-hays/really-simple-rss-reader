import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017";

export class Client {
  #client: MongoClient

  constructor() {
    this.#client = new MongoClient(connectionString);
  }

  async init() {
    await this.#client.connect()
  }

  async read(db : string, collection : string) {
    console.log(this.#client, db, collection)
  }
}

