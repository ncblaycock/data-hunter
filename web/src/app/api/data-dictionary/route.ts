import { DataDictionaryRow } from "@/db/entities";
import { collectionHandlers } from "@/lib/entity-crud";

const { GET, POST } = collectionHandlers(DataDictionaryRow);

export { GET, POST };
