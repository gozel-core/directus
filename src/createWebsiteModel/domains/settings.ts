import type { DirectusCollection, DirectusFolder } from "@directus/sdk";
import { commonFields } from "../commonFields/index";
import { createFieldRecipe } from "../factory/index";
import { commonRelations } from "../commonRelations/index";

export function getName(namespace: string) {
    const name = "settings";
    return `${namespace}_${name}`;
}

export function getCollectionNames(namespace: string) {
    return [getName(namespace)];
}

export function getRecipe(
    namespace: string,
    folder: DirectusCollection,
    _publicFolder?: DirectusFolder,
): Operation[] {
    const collectionName = getName(namespace);

    return [
        {
            name: "CREATE_COLLECTION",
            recipe: {
                collection: collectionName,
                meta: {
                    collection: collectionName,
                    icon: null,
                    note: null,
                    display_template: null,
                    hidden: false,
                    singleton: false,
                    translations: [
                        {
                            language: "en-US",
                            translation: "Settings",
                        },
                    ],
                    archive_field: null,
                    archive_app_filter: true,
                    archive_value: "archived",
                    unarchive_value: "draft",
                    sort_field: null,
                    accountability: "all",
                    color: null,
                    item_duplication_fields: null,
                    sort: 6,
                    preview_url: null,
                    versioning: false,
                    group: folder.collection,
                    collapse: "open",
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
        {
            name: "CREATE_FIELD",
            recipe: createFieldRecipe(
                "maintenance_mode",
                "boolean",
                false,
                false,
            ),
        },
        {
            name: "CREATE_FIELD",
            recipe: createFieldRecipe(
                "search_engine_indexing",
                "boolean",
                false,
                false,
            ),
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
    ];
}
