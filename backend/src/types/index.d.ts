import {DbClient} from "../db/client";
import {CacheClient} from "../cache/client";

declare global {
  namespace Express {
    interface Request {
      db: DbClient,
      cache: CacheClient 
    }
  }
}