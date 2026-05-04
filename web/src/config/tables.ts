export type TableConfig = {
  slug: string;
  /** Human label */
  label: string;
  /** Postgres-style identifier shown as public.<name> */
  sqlName: string;
  description: string;
  apiBase: string;
  /** Row count / size hint badge */
  sizeHint?: string;
  /** Red “UNRESTRICTED” badge (visual parity with Supabase demos) */
  unrestricted?: boolean;
};

export const TABLES: TableConfig[] = [
  {
    slug: "customer-flight-activity",
    label: "Customer Flight Activity",
    sqlName: "customer_flight_activity",
    description: "Monthly flights, distance, and loyalty points by member.",
    apiBase: "/api/customer-flight-activity",
    sizeHint: "Large",
    unrestricted: true,
  },
  {
    slug: "customer-loyalty-history",
    label: "Customer Loyalty History",
    sqlName: "customer_loyalty_history",
    description: "Member demographics, CLV, and enrollment attributes.",
    apiBase: "/api/customer-loyalty-history",
  },
  {
    slug: "calendar",
    label: "Calendar",
    sqlName: "calendar",
    description: "Date spine with quarter and month boundaries.",
    apiBase: "/api/calendar",
  },
  {
    slug: "data-dictionary",
    label: "Data Dictionary",
    sqlName: "data_dictionary",
    description: "Field definitions from the source dictionary CSV.",
    apiBase: "/api/data-dictionary",
    unrestricted: true,
  },
];
