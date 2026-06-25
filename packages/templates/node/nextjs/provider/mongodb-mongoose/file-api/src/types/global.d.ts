import { Connection } from "mongoose";

declare global {
  var mongooseCache:
    | {
        conn: Connection | null;
        promise: Promise<Connection> | null;
      }
    | undefined;
}

export {};
