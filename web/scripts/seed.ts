import { mkdirSync } from "fs";
import { createReadStream } from "fs";
import path from "path";
import { parse } from "csv-parse";
import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  CalendarEntry,
  CustomerFlightActivity,
  CustomerLoyaltyHistory,
  DataDictionaryRow,
} from "../src/db/entities";

const repoRoot = path.resolve(__dirname, "..", "..");

const CSV_FILES = {
  flightActivity: path.join(repoRoot, "Customer Flight Activity.csv"),
  loyaltyHistory: path.join(repoRoot, "Customer Loyalty History.csv"),
  calendar: path.join(repoRoot, "Calendar.csv"),
  dictionary: path.join(repoRoot, "Airline Loyalty Data Dictionary.csv"),
} as const;

function int(s: string): number {
  return Number.parseInt(String(s).trim(), 10);
}

function num(s: string): number {
  return Number(String(s).trim());
}

function numOrNull(s: string): number | null {
  const t = String(s ?? "").trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

async function seedFlightActivity(ds: DataSource) {
  const repo = ds.getRepository(CustomerFlightActivity);
  const batch: Array<Record<string, unknown>> = [];
  const batchSize = 1500;
  const seenKeys = new Set<string>();
  const parser = createReadStream(CSV_FILES.flightActivity).pipe(
    parse({
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }),
  );

  for await (const row of parser as AsyncIterable<Record<string, string>>) {
    const loyaltyNumber = int(row["Loyalty Number"]);
    const year = int(row.Year);
    const month = int(row.Month);
    const periodKey = `${loyaltyNumber}-${year}-${month}`;
    if (seenKeys.has(periodKey)) continue;
    seenKeys.add(periodKey);

    batch.push({
      loyaltyNumber,
      year,
      month,
      totalFlights: int(row["Total Flights"]),
      distance: int(row.Distance),
      pointsAccumulated: int(row["Points Accumulated"]),
      pointsRedeemed: int(row["Points Redeemed"]),
      dollarCostPointsRedeemed: int(row["Dollar Cost Points Redeemed"]),
    });
    if (batch.length >= batchSize) {
      await repo.insert(batch);
      batch.length = 0;
      process.stdout.write(".");
    }
  }
  if (batch.length) await repo.insert(batch);
  process.stdout.write("\n");
}

async function seedLoyaltyHistory(ds: DataSource) {
  const repo = ds.getRepository(CustomerLoyaltyHistory);
  const batch: Array<Record<string, unknown>> = [];
  const batchSize = 500;
  const parser = createReadStream(CSV_FILES.loyaltyHistory).pipe(
    parse({
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }),
  );

  for await (const row of parser as AsyncIterable<Record<string, string>>) {
    batch.push({
      loyaltyNumber: int(row["Loyalty Number"]),
      country: row.Country,
      province: row.Province,
      city: row.City,
      postalCode: row["Postal Code"],
      gender: row.Gender,
      education: row.Education?.trim() ? row.Education : null,
      salary: numOrNull(row.Salary),
      maritalStatus: row["Marital Status"],
      loyaltyCard: row["Loyalty Card"],
      clv: num(row.CLV),
      enrollmentType: row["Enrollment Type"],
      enrollmentYear: int(row["Enrollment Year"]),
      enrollmentMonth: int(row["Enrollment Month"]),
      cancellationYear: numOrNull(row["Cancellation Year"]),
      cancellationMonth: numOrNull(row["Cancellation Month"]),
    });
    if (batch.length >= batchSize) {
      await repo.insert(batch);
      batch.length = 0;
    }
  }
  if (batch.length) await repo.insert(batch);
}

async function seedCalendar(ds: DataSource) {
  const repo = ds.getRepository(CalendarEntry);
  const batch: Array<Record<string, unknown>> = [];
  const batchSize = 500;
  const parser = createReadStream(CSV_FILES.calendar).pipe(
    parse({
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }),
  );

  for await (const row of parser as AsyncIterable<Record<string, string>>) {
    batch.push({
      date: row.Date,
      startOfYear: row["Start of Year"],
      startOfQuarter: row["Start of Quarter"],
      startOfMonth: row["Start of Month"],
    });
    if (batch.length >= batchSize) {
      await repo.insert(batch);
      batch.length = 0;
    }
  }
  if (batch.length) await repo.insert(batch);
}

async function seedDictionary(ds: DataSource) {
  const repo = ds.getRepository(DataDictionaryRow);
  const batch: Array<Record<string, unknown>> = [];
  let currentTable = "";
  const parser = createReadStream(CSV_FILES.dictionary).pipe(
    parse({
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }),
  );

  for await (const row of parser as AsyncIterable<Record<string, string>>) {
    const tableCell = (row.Table ?? "").trim();
    if (tableCell) currentTable = tableCell;
    const field = (row.Field ?? "").trim();
    if (!field || !currentTable) continue;
    batch.push({
      tableName: currentTable,
      fieldName: field,
      description: (row.Description ?? "").trim(),
    });
    if (batch.length >= 100) {
      await repo.insert(batch);
      batch.length = 0;
    }
  }
  if (batch.length) await repo.insert(batch);
}

async function main() {
  const dataDir = path.join(process.cwd(), "data");
  mkdirSync(dataDir, { recursive: true });

  const ds = new DataSource({
    type: "better-sqlite3",
    database: path.join(dataDir, "app.sqlite"),
    entities: [
      CustomerFlightActivity,
      CustomerLoyaltyHistory,
      CalendarEntry,
      DataDictionaryRow,
    ],
    synchronize: true,
    logging: false,
  });

  await ds.initialize();
  console.info("Clearing tables…");
  await ds.getRepository(DataDictionaryRow).clear();
  await ds.getRepository(CalendarEntry).clear();
  await ds.getRepository(CustomerLoyaltyHistory).clear();
  await ds.getRepository(CustomerFlightActivity).clear();

  console.info("Seeding data dictionary…");
  await seedDictionary(ds);
  console.info("Seeding calendar…");
  await seedCalendar(ds);
  console.info("Seeding loyalty history...");
  await seedLoyaltyHistory(ds);
  console.info("Seeding flight activity (may take several minutes)…");
  await seedFlightActivity(ds);

  await ds.destroy();
  console.info("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
