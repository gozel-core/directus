export function getRecipe(
    namespace: string,
    collectionTranslations: string,
    collection: string,
) {
    return {
        collection: collectionTranslations,
        field: `${namespace}_languages_id`,
        related_collection: `${namespace}_languages`,
        schema: {
            constraint_name: `${collectionTranslations}_${namespace}_languages_id_foreign`,
            table: collectionTranslations,
            column: `${namespace}_languages_id`,
            foreign_key_schema: "public",
            foreign_key_table: `${namespace}_languages`,
            foreign_key_column: "id",
            on_update: "NO ACTION",
            on_delete: "SET NULL",
        },
        meta: {
            many_collection: collectionTranslations,
            many_field: `${namespace}_languages_id`,
            one_collection: `${namespace}_languages`,
            one_field: null,
            one_collection_field: null,
            one_allowed_collections: null,
            junction_field: `${collection}_id`,
            sort_field: null,
            one_deselect_action: "nullify",
        },
    };
}
