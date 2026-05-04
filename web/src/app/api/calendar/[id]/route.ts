import { CalendarEntry } from "@/db/entities";
import { itemHandlers } from "@/lib/entity-crud";

const { GET, PATCH, DELETE } = itemHandlers(CalendarEntry);

export { GET, PATCH, DELETE };
