export function getRecipe(
    namespace: string,
    collectionTranslations: string,
    collection: string,
) {
    return {
        collection: collectionTranslations,
        field: `${collection}_id`,
        related_collection: collection,
        schema: {
            constraint_name: `${collectionTranslations}_${collection}_id_foreign`,
            table: collectionTranslations,
            column: `${collection}_id`,
            foreign_key_schema: "public",
            foreign_key_table: collection,
            foreign_key_column: "id",
            on_update: "NO ACTION",
            on_delete: "SET NULL",
        },
        meta: {
            many_collection: collectionTranslations,
            many_field: `${collection}_id`,
            one_collection: collection,
            one_field: "translations",
            one_collection_field: null,
            one_allowed_collections: null,
            junction_field: `${namespace}_languages_id`,
            sort_field: null,
            one_deselect_action: "nullify",
        },
    };
}
