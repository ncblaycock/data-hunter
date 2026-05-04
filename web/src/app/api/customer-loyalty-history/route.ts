import { CustomerLoyaltyHistory } from "@/db/entities";
import { collectionHandlers } from "@/lib/entity-crud";

const { GET, POST } = collectionHandlers(CustomerLoyaltyHistory);

export { GET, POST };
