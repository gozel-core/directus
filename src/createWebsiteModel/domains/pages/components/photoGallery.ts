import type { DirectusCollection, DirectusFolder } from "@directus/sdk";
import { commonFields } from "../../../commonFields/index";
import { createFieldRecipe } from "../../../factory/index";
import { commonRelations } from "../../../commonRelations/index";

export function getName(namespace: string) {
    const prefix = "component";
    const name = "photo_gallery";
    return `${namespace}_${prefix}_${name}`;
}

export function getCollectionNames(namespace: string) {
    const collectionName = getName(namespace);
    const collectionNameFiles = collectionName + "_files";
    return [collectionName, collectionNameFiles];
}

export function getRecipe(
    namespace: string,
    folder: DirectusCollection,
    publicFolder: DirectusFolder,
): Operation[] {
    const collectionName = getName(namespace);
    const collectionNameFiles = collectionName + "_files";

    return [
        {
            name: "CREATE_COLLECTION",
            recipe: {
                collection: collectionName,
                meta: {
                    collection: collectionName,
                    icon: null,
                    note: null,
                    display_template: "{{status}}{{photos}}",
                    hidden: true,
                    singleton: false,
                    translations: [
                        {
                            language: "en-US",
                            translation: "Photo Gallery",
                        },
                    ],
                    archive_field: "status",
                    archive_app_filter: true,
                    archive_value: "archived",
                    unarchive_value: "draft",
                    sort_field: null,
                    accountability: "all",
                    color: null,
                    item_duplication_fields: null,
                    group: folder.collection,
                    collapse: "open",
                    preview_url: null,
                    versioning: false,
                },
                schema: {
                    schema: "public",
                    name: collectionName,
                    comment: null,
                },
            },
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.status.getRecipe(),
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.userCreated.getRecipe(),
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.userUpdated.getRecipe(),
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.dateCreated.getRecipe(),
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.dateUpdated.getRecipe(),
        },
        // @ts-ignore
        {
            name: "CREATE_FIELD",
            recipe: {
                field: "photos",
                type: "alias",
                schema: null,
                meta: {
                    field: "photos",
                    special: ["files"],
                    interface: "files",
                    options: {
                        folder: publicFolder.id,
                    },
                    display: null,
                    display_options: null,
                    readonly: false,
                    hidden: false,
                    width: "full",
                    translations: null,
                    note: null,
                    conditions: null,
                    required: false,
                    group: null,
                },
            },
        },
        {
            name: "CREATE_FIELD",
            recipe: createFieldRecipe("frontend_component", "string", false),
        },
        {
            name: "DELETE_RELATION",
            recipe: {
                field: "user_created",
            },
        },
        {
            name: "DELETE_RELATION",
            recipe: {
                field: "user_updated",
            },
        },
        {
            name: "CREATE_RELATION",
            recipe: commonRelations.userCreated.getRecipe(collectionName),
        },
        {
            name: "CREATE_RELATION",
            recipe: commonRelations.userUpdated.getRecipe(collectionName),
        },
        {
            name: "CREATE_COLLECTION",
            recipe: {
                collection: collectionNameFiles,
                meta: {
                    collection: collectionNameFiles,
                    icon: null,
                    note: null,
                    hidden: true,
                    singleton: false,
                    accountability: "all",
                    color: null,
                    item_duplication_fields: null,
                    preview_url: null,
                    versioning: false,
                    group: folder.collection,
                    collapse: "open",
                },
                schema: {
                    schema: "public",
                    name: collectionNameFiles,
                    comment: null,
                },
            },
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.userCreated.getRecipe(),
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.dateCreated.getRecipe(),
        },
        {
            name: "CREATE_FIELD",
            recipe: {
                field: `${collectionName}_id`,
                type: "integer",
                schema: {
                    data_type: "integer",
                    default_value: null,
                    generation_expression: null,
                    max_length: null,
                    numeric_precision: 32,
                    numeric_scale: 0,
                    is_generated: false,
                    is_nullable: true,
                    is_unique: false,
                    is_indexed: false,
                    is_primary_key: false,
                    has_auto_increment: false,
                    foreign_key_schema: "public",
                    foreign_key_table: `${collectionName}`,
                    foreign_key_column: "id",
                    comment: null,
                },
                meta: {
                    special: null,
                    interface: null,
                    options: null,
                    display: null,
                    display_options: null,
                    readonly: false,
                    hidden: true,
                    width: "full",
                    translations: null,
                    note: null,
                    conditions: null,
                    required: false,
                    group: null,
                    validation: null,
                    validation_message: null,
                },
            },
        },
        {
            name: "CREATE_FIELD",
            recipe: {
                field: "directus_files_id",
                type: "uuid",
                schema: {
                    name: "directus_files_id",
                    data_type: "uuid",
                    default_value: null,
                    generation_expression: null,
                    max_length: null,
                    numeric_precision: null,
                    numeric_scale: null,
                    is_generated: false,
                    is_nullable: true,
                    is_unique: false,
                    is_indexed: false,
                    is_primary_key: false,
                    has_auto_increment: false,
                    foreign_key_schema: "public",
                    foreign_key_table: "directus_files",
                    foreign_key_column: "id",
                    comment: null,
                },
                meta: {
                    field: "directus_files_id",
                    special: null,
                    interface: null,
                    options: null,
                    display: null,
                    display_options: null,
                    readonly: false,
                    hidden: true,
                    width: "full",
                    translations: null,
                    note: null,
                    conditions: null,
                    required: false,
                    group: null,
                    validation: null,
                    validation_message: null,
                },
            },
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.sort.getRecipe("photo_sort"),
        },
        {
            name: "DELETE_RELATION",
            recipe: {
                field: "user_created",
            },
        },
        {
            name: "DELETE_RELATION",
            recipe: {
                field: `${collectionName}_id`,
            },
        },
        {
            name: "DELETE_RELATION",
            recipe: {
                field: `directus_files_id`,
            },
        },
        {
            name: "CREATE_RELATION",
            recipe: commonRelations.userCreated.getRecipe(collectionNameFiles),
        },
        {
            name: "CREATE_RELATION",
            recipe: {
                collection: collectionNameFiles,
                field: `${collectionName}_id`,
                related_collection: collectionName,
                schema: {
                    constraint_name: `${collectionNameFiles}_${collectionName}_id_foreign`,
                    table: collectionNameFiles,
                    column: `${collectionName}_id`,
                    foreign_key_schema: "public",
                    foreign_key_table: collectionName,
                    foreign_key_column: "id",
                    on_update: "NO ACTION",
                    on_delete: "SET NULL",
                },
                meta: {
                    many_collection: collectionNameFiles,
                    many_field: `${collectionName}_id`,
                    one_collection: collectionName,
                    one_field: "photos",
                    one_collection_field: null,
                    one_allowed_collections: null,
                    junction_field: "directus_files_id",
                    sort_field: "photo_sort",
                    one_deselect_action: "nullify",
                },
            },
        },
        {
            name: "CREATE_RELATION",
            recipe: {
                collection: collectionNameFiles,
                field: "directus_files_id",
                related_collection: "directus_files",
                schema: {
                    constraint_name: `${collectionNameFiles}_${collectionName}_directus_files_id_foreign`,
                    table: collectionNameFiles,
                    column: "directus_files_id",
                    foreign_key_schema: "public",
                    foreign_key_table: "directus_files",
                    foreign_key_column: "id",
                    on_update: "NO ACTION",
                    on_delete: "SET NULL",
                },
                meta: {
                    many_collection: collectionNameFiles,
                    many_field: "directus_files_id",
                    one_collection: "directus_files",
                    one_field: null,
                    one_collection_field: null,
                    one_allowed_collections: null,
                    junction_field: `${collectionName}_id`,
                    sort_field: null,
                    one_deselect_action: "nullify",
                },
            },
        },
    ];
}
