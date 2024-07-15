import { MongoClient } from "mongodb";

//  docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $INSTANCE_ID For Local
const connectionString = process.env.MONGODB_CONNECTION_STRING || "mongodb://172.17.0.3:27017";

export class Client {
  #client: MongoClient

  constructor() {
    this.#client = new MongoClient(connectionString);
  }

  async init() {
    await this.#client.connect()
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

