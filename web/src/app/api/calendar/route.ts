import { CalendarEntry } from "@/db/entities";
import { collectionHandlers } from "@/lib/entity-crud";

const { GET, POST } = collectionHandlers(CalendarEntry);

export { GET, POST };
