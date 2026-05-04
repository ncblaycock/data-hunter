import { CustomerLoyaltyHistory } from "@/db/entities";
import { itemHandlers } from "@/lib/entity-crud";

const { GET, PATCH, DELETE } = itemHandlers(CustomerLoyaltyHistory);

export { GET, PATCH, DELETE };
