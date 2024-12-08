import type { DirectusCollection, DirectusFolder } from "@directus/sdk";
import { commonFields } from "../../commonFields/index";
import { createFieldRecipe } from "../../factory/index";
import { components } from "./components/index";
import { commonRelations } from "../../commonRelations/index";

export function getName(namespace: string) {
    const name = "pages";
    return `${namespace}_${name}`;
}

export function getCollectionNames(namespace: string) {
    const collectionName = getName(namespace);
    const collectionNameTranslations = collectionName + "_translations";
    const collectionNameComponents = collectionName + "_components";
    const componentList = Object.keys(components)
        .map((k) =>
            components[k as keyof typeof components].getCollectionNames(
                namespace,
            ),
        )
        .reduce((memo, arr) => memo.concat(arr), []);
    return [
        collectionName,
        collectionNameTranslations,
        collectionNameComponents,
    ].concat(componentList);
}

export function getRecipe(
    namespace: string,
    folder: DirectusCollection,
    publicFolder: DirectusFolder,
): Operation[] {
    const collectionName = getName(namespace);
    const collectionNameTranslations = collectionName + "_translations";
    const collectionNameComponents = collectionName + "_components";
    const componentFieldDisplayTemplate = Object.keys(components)
        .map(
            (k) =>
                "{{item:" +
                components[k as keyof typeof components].getName(namespace) +
                "}}",
        )
        .join("");
    const componentList = Object.keys(components).map((k) =>
        components[k as keyof typeof components].getName(namespace),
    );

    const preOps = Object.keys(components)
        .map((k) =>
            components[k as keyof typeof components].getRecipe(
                namespace,
                folder,
                publicFolder,
            ),
        )
        .reduce((arr, memo) => memo.concat(arr), []);

    const ops: Operation[] = [
        {
            name: "CREATE_COLLECTION",
            recipe: {
                collection: `${namespace}_pages`,
                meta: {
                    collection: collectionName,
                    icon: null,
                    note: null,
                    display_template: "{{status}}{{translations}}",
                    hidden: false,
                    singleton: false,
                    translations: [
                        {
                            language: "en-US",
                            translation: "Pages",
                        },
                    ],
                    archive_field: "status",
                    archive_app_filter: true,
                    archive_value: "archived",
                    unarchive_value: "draft",
                    sort_field: "sort",
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
            recipe: commonFields.status.getRecipe(),
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.sort.getRecipe(),
        },
        {
            name: "CREATE_FIELD",
            recipe: commonFields.image.getRecipe("cover", publicFolder),
        },
        {
            name: "CREATE_FIELD",
            recipe: {
                field: "search_engine_robots_directives",
                type: "json",
                schema: {
                    data_type: "json",
                    default_value: ["all"],
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
                    field: "search_engine_robots_directives",
                    special: ["cast-json"],
                    interface: "tags",
                    options: {
                        presets: ["all", "noindex", "nofollow"],
                        alphabetize: true,
                    },
                    display: null,
                    display_options: null,
                    readonly: false,
                    hidden: false,
                    width: "half",
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
            recipe: createFieldRecipe("canonical_url", "string", false, null, {
                width: "half",
            }),
        },
        {
            name: "CREATE_FIELD",
            recipe: {
                field: "routing_identifiers",
                type: "json",
                schema: {
                    data_type: "json",
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
                    field: "routing_identifiers",
                    special: ["cast-json"],
                    interface: "tags",
                    options: {
                        alphabetize: true,
                        whitespace: "_",
                        capitalization: "uppercase",
                    },
                    display: null,
                    display_options: null,
                    readonly: false,
                    hidden: false,
                    width: "half",
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
                field: "frontend_component",
                type: "string",
                schema: {
                    data_type: "character varying",
                    default_value: "Auto",
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
                    field: "frontend_component",
                    special: null,
                    interface: "select-dropdown",
                    options: {
                        choices: [
                            {
                                text: "Auto",
                                value: "Auto",
                            },
                            {
                                text: "RegularPage",
                                value: "RegularPage",
                            },
                            {
                                text: "Home",
                                value: "Home",
                            },
                            {
                                text: "NotFound",
                                value: "NotFound",
                            },
                        ],
                        allowOther: true,
                    },
                    display: null,
                    display_options: null,
                    readonly: false,
                    hidden: false,
                    width: "half",
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
                field: "navigation_parent",
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
                    foreign_key_table: `${namespace}_pages`,
                    foreign_key_column: "id",
                    comment: null,
                },
                meta: {
                    field: "navigation_parent",
                    special: ["m2o"],
                    interface: "select-dropdown-m2o",
                    options: {
                        template: "{{translations}}",
                        enableCreate: false,
                    },
                    display: "related-values",
                    display_options: {
                        template: "{{translations}}",
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
        // @ts-ignore
        {
            name: "CREATE_FIELD",
            recipe: {
                field: "components",
                type: "alias",
                schema: null,
                meta: {
                    field: "components",
                    special: ["m2a"],
                    interface: "list-m2a",
                    options: null,
                    display: "related-values",
                    display_options: {
                        template: componentFieldDisplayTemplate,
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
            name: "DELETE_RELATION",
            recipe: {
                field: "cover",
            },
        },
        {
            name: "DELETE_RELATION",
            recipe: {
                field: "navigation_parent",
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
            name: "CREATE_RELATION",
            recipe: commonRelations.image.getRecipe(collectionName, "cover"),
        },
        {
            name: "CREATE_RELATION",
            recipe: {
                collection: collectionName,
                field: "navigation_parent",
                related_collection: collectionName,
                schema: {
                    constraint_name: `${collectionName}_navigation_parent_foreign`,
                    table: collectionName,
                    column: "navigation_parent",
                    foreign_key_schema: "public",
                    foreign_key_table: collectionName,
                    foreign_key_column: "id",
                    on_update: "NO ACTION",
                    on_delete: "NO ACTION",
                },
                meta: {
                    many_collection: collectionName,
                    many_field: "navigation_parent",
                    one_collection: collectionName,
                    one_field: null,
                    one_collection_field: null,
                    one_allowed_collections: null,
                    junction_field: null,
                    sort_field: null,
                    one_deselect_action: "nullify",
                },
            },
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
            recipe: createFieldRecipe("title", "string", true, null),
        },
        {
            name: "CREATE_FIELD",
            recipe: {
                field: "slug",
                type: "string",
                schema: {
                    name: "slug",
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
                    field: "slug",
                    special: null,
                    interface: "input",
                    options: null,
                    display: null,
                    display_options: null,
                    readonly: false,
                    hidden: true,
                    width: "full",
                    translations: null,
                    note: null,
                    conditions: [
                        {
                            name: "show when update url enabled",
                            rule: {
                                _and: [
                                    {
                                        update_url: {
                                            _eq: true,
                                        },
                                    },
                                ],
                            },
                            hidden: false,
                            options: {
                                font: "sans-serif",
                                trim: false,
                                masked: false,
                                clear: false,
                                slug: false,
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
            name: "CREATE_FIELD",
            recipe: {
                collection: collectionNameTranslations,
                field: "update_url",
                type: "boolean",
                schema: {
                    name: "update_url",
                    table: collectionNameTranslations,
                    data_type: "boolean",
                    default_value: false,
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
                    collection: collectionNameTranslations,
                    field: "update_url",
                    special: ["cast-boolean"],
                    interface: "boolean",
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
            recipe: {
                collection: collectionNameTranslations,
                field: "excerpt",
                type: "text",
                schema: {
                    name: "excerpt",
                    table: collectionNameTranslations,
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
                    collection: collectionNameTranslations,
                    field: "excerpt",
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
        {
            name: "CREATE_COLLECTION",
            recipe: {
                collection: collectionNameComponents,
                meta: {
                    collection: collectionNameComponents,
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
                    name: collectionNameComponents,
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
            recipe: commonFields.sort.getRecipe(),
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
                field: "item",
                type: "string",
                schema: {
                    name: "item",
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
                    field: "item",
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
                field: "collection",
                type: "string",
                schema: {
                    name: "collection",
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
                    field: "collection",
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
                field: "item",
            },
        },
        {
            name: "CREATE_RELATION",
            recipe: commonRelations.userCreated.getRecipe(
                collectionNameComponents,
            ),
        },
        {
            name: "CREATE_RELATION",
            recipe: {
                collection: collectionNameComponents,
                field: `${collectionName}_id`,
                related_collection: collectionName,
                schema: {
                    constraint_name: `${collectionNameComponents}_${collectionName}_id_foreign`,
                    table: collectionNameComponents,
                    column: `${collectionName}_id`,
                    foreign_key_schema: "public",
                    foreign_key_table: collectionName,
                    foreign_key_column: "id",
                    on_update: "NO ACTION",
                    on_delete: "CASCADE",
                },
                meta: {
                    many_collection: collectionNameComponents,
                    many_field: `${collectionName}_id`,
                    one_collection: collectionName,
                    one_field: "components",
                    one_collection_field: null,
                    one_allowed_collections: null,
                    junction_field: "item",
                    sort_field: "sort",
                    one_deselect_action: "nullify",
                },
            },
        },
        {
            name: "CREATE_RELATION",
            recipe: {
                collection: collectionNameComponents,
                field: "item",
                //related_collection: null,
                //schema: null,
                meta: {
                    many_collection: collectionNameComponents,
                    many_field: "item",
                    one_collection: null,
                    one_field: null,
                    one_collection_field: "collection",
                    // @ts-ignore
                    one_allowed_collections: componentList,
                    junction_field: `${collectionName}_id`,
                    sort_field: null,
                    one_deselect_action: "nullify",
                },
            },
        },
    ];

    return preOps.concat(ops);
}
