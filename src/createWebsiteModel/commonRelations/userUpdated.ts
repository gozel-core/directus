import type { DirectusRelation } from "@directus/sdk";

export function getRecipe(
    collection: string,
    field = "user_updated",
): NestedPartial<DirectusRelation> {
    return {
        collection: collection,
        field: field,
        related_collection: "directus_users",
        schema: {
            constraint_name: `${collection}_${field}_foreign`,
            table: collection,
            column: field,
            foreign_key_schema: "public",
            foreign_key_table: "directus_users",
            foreign_key_column: "id",
            on_update: "NO ACTION",
            on_delete: "NO ACTION",
        },
        meta: {
            many_collection: collection,
            many_field: field,
            one_collection: "directus_users",
            one_field: null,
            one_collection_field: null,
            one_allowed_collections: null,
            junction_field: null,
            sort_field: null,
            one_deselect_action: "nullify",
        },
    };
}
