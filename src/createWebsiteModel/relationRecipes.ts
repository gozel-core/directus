export function getRelationRecipe(
    name: string,
    { collection, field }: { collection: string; field?: string },
) {
    if (name === "userCreated") {
        return {
            collection: collection,
            field: "user_created",
            related_collection: "directus_users",
            schema: {
                constraint_name: `${collection}_user_created_foreign`,
                table: collection,
                column: "user_created",
                foreign_key_schema: "public",
                foreign_key_table: "directus_users",
                foreign_key_column: "id",
                on_update: "NO ACTION",
                on_delete: "NO ACTION",
            },
            meta: {
                many_collection: collection,
                many_field: "user_created",
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

    if (name === "userUpdated") {
        return {
            collection: collection,
            field: "user_updated",
            related_collection: "directus_users",
            schema: {
                constraint_name: `${collection}_user_updated_foreign`,
                table: collection,
                column: "user_updated",
                foreign_key_schema: "public",
                foreign_key_table: "directus_users",
                foreign_key_column: "id",
                on_update: "NO ACTION",
                on_delete: "NO ACTION",
            },
            meta: {
                many_collection: collection,
                many_field: "user_updated",
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

    if (name === "image") {
        return {
            collection: collection,
            field: "cover",
            related_collection: "directus_files",
            schema: {
                constraint_name: `${collection}_cover_foreign`,
                table: collection,
                column: "cover",
                foreign_key_schema: "public",
                foreign_key_table: "directus_files",
                foreign_key_column: "id",
                on_update: "NO ACTION",
                on_delete: "SET NULL",
            },
            meta: {
                many_collection: collection,
                many_field: "cover",
                one_collection: "directus_files",
                one_field: null,
                one_collection_field: null,
                one_allowed_collections: null,
                junction_field: null,
                sort_field: null,
                one_deselect_action: "nullify",
            },
        };
    }

    return;
}
