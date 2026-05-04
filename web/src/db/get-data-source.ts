import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import {
  CalendarEntry,
  CustomerFlightActivity,
  CustomerLoyaltyHistory,
  DataDictionaryRow,
} from "./entities";

const globalForDb = globalThis as unknown as {
  dataSource?: DataSource;
};

export async function getDataSource(): Promise<DataSource> {
  if (globalForDb.dataSource?.isInitialized) {
    return globalForDb.dataSource;
  }

  const dataSource = new DataSource({
    type: "better-sqlite3",
    database: path.join(process.cwd(), "data", "app.sqlite"),
    entities: [
      CustomerFlightActivity,
      CustomerLoyaltyHistory,
      CalendarEntry,
      DataDictionaryRow,
    ],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  globalForDb.dataSource = dataSource;
  return dataSource;
}
