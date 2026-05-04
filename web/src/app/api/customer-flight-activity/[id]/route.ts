import { CustomerFlightActivity } from "@/db/entities";
import { itemHandlers } from "@/lib/entity-crud";

const { GET, PATCH, DELETE } = itemHandlers(CustomerFlightActivity);

export { GET, PATCH, DELETE };
