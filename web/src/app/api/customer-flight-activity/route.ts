import { CustomerFlightActivity } from "@/db/entities";
import { collectionHandlers } from "@/lib/entity-crud";

const { GET, POST } = collectionHandlers(CustomerFlightActivity);

export { GET, POST };
