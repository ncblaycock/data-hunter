import { DataDictionaryRow } from "@/db/entities";
import { itemHandlers } from "@/lib/entity-crud";

const { GET, PATCH, DELETE } = itemHandlers(DataDictionaryRow);

export { GET, PATCH, DELETE };
