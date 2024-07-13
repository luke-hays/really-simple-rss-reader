import { Client } from "../db/client";

declare global {
  namespace Express {
    interface Request {
      db: Client
    }
  }
}