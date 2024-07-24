import {MongoClient} from "mongodb";

const connectionString = process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017";

export class DbClient {
  #client: MongoClient

  constructor() {
    this.#client = new MongoClient(connectionString);
  }

  async init() {
    await this.#client.connect()
    console.log('Connected to database.')
  }

  read({dbName, collectionName} : DbParams) {
    const db = this.#client.db(dbName)
    const collection = db.collection(collectionName)
    return collection
  }

  async insertRecord({dbName, collectionName} : DbParams, record : object) {
    const db = this.#client.db(dbName)
    const collection = db.collection(collectionName)

    return await collection.insertOne(record)
  }
}

