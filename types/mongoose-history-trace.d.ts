declare module "mongoose-history-trace" {
  import type { Schema, Connection } from "mongoose";

  interface HistoryTraceOptions {
    mongooseConnection: Connection;
    isAuthenticated?: boolean;
    userPaths?: string[];
    customCollectionName?: string;
    moduleName?: string;
    omitPaths?: string[];
  }

  function mongooseHistoryTrace(
    schema: Schema,
    options: HistoryTraceOptions,
  ): void;

  export = mongooseHistoryTrace;
}
