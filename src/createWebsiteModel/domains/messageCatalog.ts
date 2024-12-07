import type { DirectusCollection, DirectusFolder } from "@directus/sdk";
import { commonFields } from "../commonFields/index";
import { commonRelations } from "../commonRelations/index";
import { createFieldRecipe } from "../factory/index";

export function getName(namespace: string) {
    const name = "message_catalog";
    return `${namespace}_${name}`;
}

export function getCollectionNames(namespace: string) {
    const collectionName = getName(namespace);
    const collectionNameTranslations = collectionName + "_translations";
    return [collectionName, collectionNameTranslations];
}

export function getRecipe(
    namespace: string,
    folder: DirectusCollection,
    publicFolder: DirectusFolder,
): Operation[] {
    const collectionName = getName(namespace);
    const collectionNameTranslations = collectionName + "_translations";

    return [
        {
            name: "CREATE_COLLECTION",
            recipe: {
                collection: collectionName,
                meta: {
                    collection: collectionName,
                    icon: null,
                    note: null,
                    display_template: "{{translations}}",
                    hidden: false,
                    singleton: false,
                    translations: [
                        {
                            language: "en-US",
                            translation: "Message Catalog",
                        },
                    ],
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
            recipe: {
                field: "key",
                type: "string",
                schema: {
                    data_type: "character varying",
                    default_value: null,
                    generation_expression: null,
                    max_length: 255,
                    numeric_precision: null,
                    numeric_scale: null,
                    is_generated: false,
                    is_nullable: true,
                    is_unique: false,
                    is_indexed: false,
                    is_primary_key: false,
                    has_auto_increment: false,
                    foreign_key_schema: null,
                    foreign_key_table: null,
                    foreign_key_column: null,
                    comment: null,
                },
                meta: {
                    field: "key",
                    special: null,
                    interface: "input",
                    options: null,
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
                    validation: null,
                    validation_message: null,
                },
            },
        },
        // @ts-ignore
        {
            name: "CREATE_FIELD",
            recipe: {
                field: "translations",
                type: "alias",
                schema: null,
                meta: {
                    field: "translations",
                    special: ["translations"],
                    interface: "translations",
                    options: {
                        languageField: "code",
                        userLanguage: true,
                    },
                    display: "translations",
                    display_options: {
                        template: "{{plain_text}}{{html_text}}",
                        languageField: "code",
                        userLanguage: true,
                    },
                    readonly: false,
                    hidden: false,
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
                collection: collectionNameTranslations,
                meta: {
                    collection: collectionNameTranslations,
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
                    name: collectionNameTranslations,
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
                field: `${namespace}_languages_id`,
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
                    foreign_key_table: `${namespace}_languages`,
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
                field: "plain_text",
                type: "text",
                schema: {
                    data_type: "text",
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
                    foreign_key_schema: null,
                    foreign_key_table: null,
                    foreign_key_column: null,
                    comment: null,
                },
                meta: {
                    field: "plain_text",
                    special: null,
                    interface: "input-multiline",
                    options: null,
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
                    validation: null,
                    validation_message: null,
                },
            },
        },
        {
            name: "CREATE_FIELD",
            recipe: createFieldRecipe("enable_html", "boolean", false, false),
        },
        {
            name: "CREATE_FIELD",
            recipe: {
                field: "html_text",
                type: "text",
                schema: {
                    data_type: "text",
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
                    foreign_key_schema: null,
                    foreign_key_table: null,
                    foreign_key_column: null,
                    comment: null,
                },
                meta: {
                    field: "html_text",
                    special: null,
                    interface: "input-rich-text-html",
                    options: {
                        folder: publicFolder.id,
                    },
                    display: "formatted-value",
                    display_options: {
                        format: true,
                    },
                    readonly: false,
                    hidden: true,
                    width: "full",
                    translations: null,
                    note: null,
                    conditions: [
                        {
                            name: "depends on enable_html",
                            rule: {
                                _and: [
                                    {
                                        enable_html: {
                                            _eq: true,
                                        },
                                    },
                                ],
                            },
                            hidden: false,
                            options: {
                                // @ts-ignore
                                toolbar: commonFields.htmlText.toolbar,
                                font: "sans-serif",
                            },
                        },
                    ],
                    required: false,
                    group: null,
                    validation: null,
                    validation_message: null,
                },
            },
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
                field: `${namespace}_languages_id`,
            },
        },
        {
            name: "CREATE_RELATION",
            recipe: commonRelations.userCreated.getRecipe(
                collectionNameTranslations,
            ),
        },
        {
            name: "CREATE_RELATION",
            recipe: commonRelations.translations.getRecipe(
                namespace,
                collectionNameTranslations,
                collectionName,
            ),
        },
        {
            name: "CREATE_RELATION",
            recipe: commonRelations.language.getRecipe(
                namespace,
                collectionNameTranslations,
                collectionName,
            ),
        },
    ];
}
