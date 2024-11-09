import { getFieldRecipe } from "./fieldRecipes";
import {
    createCollection,
    createField,
    createRelation,
    deleteRelation,
    type DirectusCollection,
    type DirectusFolder,
} from "@directus/sdk";
import { getRelationRecipe } from "./relationRecipes";

export async function createPagesCollection(
    client: RefDirectusClient,
    namespace: string,
    folder: DirectusCollection,
    publicFolder: DirectusFolder,
) {
    console.log(`Creating pages collections...`);

    const name = `${namespace}_pages` as keyof RefSchema;

    await client.request(
        createCollection({
            collection: `${namespace}_pages`,
            meta: {
                collection: name,
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
                name: name,
                comment: null,
            },
        }),
    );

    const fields = [
        getFieldRecipe("status", { collection: name }),
        getFieldRecipe("sort", { collection: name }),
        getFieldRecipe("userCreated", { collection: name }),
        getFieldRecipe("dateCreated", { collection: name }),
        getFieldRecipe("userUpdated", { collection: name }),
        getFieldRecipe("dateUpdated", { collection: name }),
        {
            field: "cover",
            type: "uuid",
            schema: {
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
                field: "cover",
                special: ["file"],
                interface: "file-image",
                options: {
                    folder: publicFolder.id,
                },
                display: "image",
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
        {
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
        {
            field: "canonical_url",
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
                field: "canonical_url",
                special: null,
                interface: "input",
                options: null,
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
        {
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
        {
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
        {
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
        {
            field: "translations",
            type: "alias",
            schema: null,
            meta: {
                special: ["translations"],
                interface: "translations",
                options: {
                    languageField: "code",
                    userLanguage: true,
                },
                display: "translations",
                display_options: {
                    template: "{{title}}",
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
        {
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
                    template:
                        "{{item:website_component_single_text}}{{item:website_component_dual_text}}{{item:website_component_image_text}}{{item:website_component_event}}{{item:website_component_news_article}}{{item:website_component_downloads}}{{item:website_component_job_listing}}{{item:website_component_photo_gallery}}{{item:website_component_youtube_video}}{{item:website_component_cta}}{{item:website_component_listing}}{{item:website_component_qa}}{{item:website_component_custom}}{{item:website_component_blog_post}}{{item:website_component_link}}{{item:website_component_links}}",
                },
                readonly: false,
                hidden: false,
                sort: 18,
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
    ];

    for (const f of fields) {
        if (!f) continue;
        try {
            await client.request(createField(name as keyof RefSchema, f));
        } catch (e) {
            throw new Error("Failed to create field.", { cause: e });
        }
    }

    try {
        await client.request(deleteRelation(name, "user_created"));
        await client.request(deleteRelation(name, "user_updated"));
        await client.request(deleteRelation(name, "cover"));
        await client.request(deleteRelation(name, "navigation_parent"));
    } catch (e) {}

    await client.request(
        createRelation(getRelationRecipe("userCreated", { collection: name })!),
    );
    await client.request(
        createRelation(getRelationRecipe("userUpdated", { collection: name })!),
    );
    await client.request(
        createRelation(
            getRelationRecipe("image", { collection: name, field: "cover" })!,
        ),
    );

    await client.request(
        createRelation({
            collection: name,
            field: "navigation_parent",
            related_collection: name,
            schema: {
                constraint_name: `${name}_navigation_parent_foreign`,
                table: name,
                column: "navigation_parent",
                foreign_key_schema: "public",
                foreign_key_table: name,
                foreign_key_column: "id",
                on_update: "NO ACTION",
                on_delete: "NO ACTION",
            },
            meta: {
                many_collection: name,
                many_field: "navigation_parent",
                one_collection: name,
                one_field: null,
                one_collection_field: null,
                one_allowed_collections: null,
                junction_field: null,
                sort_field: null,
                one_deselect_action: "nullify",
            },
        }),
    );

    const name2 = `${namespace}_pages_translations`;

    await client.request(
        createCollection({
            collection: name2,
            meta: {
                collection: name2,
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
                name: name2,
                comment: null,
            },
        }),
    );

    const fields2 = [
        getFieldRecipe("userCreated", { collection: name2 }),
        getFieldRecipe("dateCreated", { collection: name2 }),
        {
            field: `${name}_id`,
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
                foreign_key_table: `${name}`,
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
        {
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
        {
            collection: name2,
            field: "title",
            type: "string",
            schema: {
                name: "title",
                table: name2,
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
                collection: name2,
                field: "title",
                special: null,
                interface: "input",
                options: null,
                display: null,
                display_options: null,
                readonly: false,
                hidden: false,
                sort: 7,
                width: "full",
                translations: null,
                note: null,
                conditions: null,
                required: true,
                group: null,
                validation: null,
                validation_message: null,
            },
        },
        {
            collection: name2,
            field: "slug",
            type: "string",
            schema: {
                name: "slug",
                table: name2,
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
                collection: name2,
                field: "slug",
                special: null,
                interface: "input",
                options: null,
                display: null,
                display_options: null,
                readonly: false,
                hidden: true,
                sort: 10,
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
        {
            collection: name2,
            field: "excerpt",
            type: "text",
            schema: {
                name: "excerpt",
                table: name2,
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
                collection: name2,
                field: "excerpt",
                special: null,
                interface: "input-multiline",
                options: null,
                display: null,
                display_options: null,
                readonly: false,
                hidden: false,
                sort: 8,
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
        {
            collection: name2,
            field: "update_url",
            type: "boolean",
            schema: {
                name: "update_url",
                table: name2,
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
                collection: name2,
                field: "update_url",
                special: ["cast-boolean"],
                interface: "boolean",
                options: null,
                display: null,
                display_options: null,
                readonly: false,
                hidden: false,
                sort: 9,
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
    ];

    for (const f of fields2) {
        if (!f) continue;
        try {
            await client.request(createField(name2 as keyof RefSchema, f));
        } catch (e) {
            throw new Error("Failed to create field.", { cause: e });
        }
    }

    try {
        await client.request(deleteRelation(name2, "user_created"));
        await client.request(deleteRelation(name2, `${name}_id`));
        await client.request(
            deleteRelation(name2, `${namespace}_languages_id`),
        );
    } catch (e) {}

    await client.request(
        createRelation(
            getRelationRecipe("userCreated", { collection: name2 })!,
        ),
    );

    await client.request(
        createRelation({
            collection: name2,
            field: `${name}_id`,
            related_collection: name,
            schema: {
                constraint_name: `${name2}_${name}_id_foreign`,
                table: name2,
                column: `${name}_id`,
                foreign_key_schema: "public",
                foreign_key_table: name,
                foreign_key_column: "id",
                on_update: "NO ACTION",
                on_delete: "SET NULL",
            },
            meta: {
                many_collection: name2,
                many_field: `${name}_id`,
                one_collection: name,
                one_field: "translations",
                one_collection_field: null,
                one_allowed_collections: null,
                junction_field: `${namespace}_languages_id`,
                sort_field: null,
                one_deselect_action: "nullify",
            },
        }),
    );

    await client.request(
        createRelation({
            collection: name2,
            field: `${namespace}_languages_id`,
            related_collection: `${namespace}_languages`,
            schema: {
                constraint_name: `${name2}_${namespace}_languages_id_foreign`,
                table: name2,
                column: `${namespace}_languages_id`,
                foreign_key_schema: "public",
                foreign_key_table: `${namespace}_languages`,
                foreign_key_column: "id",
                on_update: "NO ACTION",
                on_delete: "SET NULL",
            },
            meta: {
                many_collection: name2,
                many_field: `${namespace}_languages_id`,
                one_collection: `${namespace}_languages`,
                one_field: null,
                one_collection_field: null,
                one_allowed_collections: null,
                junction_field: `${name}_id`,
                sort_field: null,
                one_deselect_action: "nullify",
            },
        }),
    );

    const name3 = `${namespace}_pages_components`;

    await client.request(
        createCollection({
            collection: name3,
            meta: {
                collection: name3,
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
                name: name3,
                comment: null,
            },
        }),
    );

    const fields3 = [
        getFieldRecipe("userCreated", { collection: name3 }),
        getFieldRecipe("dateCreated", { collection: name3 }),
        getFieldRecipe("sort", { collection: name3 }),
        {
            field: `${name}_id`,
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
                foreign_key_table: `${name}`,
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
        {
            collection: name3,
            field: "item",
            type: "string",
            schema: {
                name: "item",
                table: name3,
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
                collection: name3,
                field: "item",
                special: null,
                interface: null,
                options: null,
                display: null,
                display_options: null,
                readonly: false,
                hidden: true,
                sort: 5,
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
        {
            collection: name3,
            field: "collection",
            type: "string",
            schema: {
                name: "collection",
                table: name3,
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
                collection: name3,
                field: "collection",
                special: null,
                interface: null,
                options: null,
                display: null,
                display_options: null,
                readonly: false,
                hidden: true,
                sort: 6,
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
    ];

    for (const f of fields3) {
        if (!f) continue;
        try {
            await client.request(createField(name3 as keyof RefSchema, f));
        } catch (e) {
            throw new Error("Failed to create field.", { cause: e });
        }
    }

    try {
        await client.request(deleteRelation(name3, "user_created"));
        await client.request(deleteRelation(name3, `${name}_id`));
        await client.request(deleteRelation(name3, `item`));
    } catch (e) {}

    await client.request(
        createRelation(
            getRelationRecipe("userCreated", { collection: name3 })!,
        ),
    );

    await client.request(
        createRelation({
            collection: name3,
            field: `${name}_id`,
            related_collection: name,
            schema: {
                constraint_name: `${name3}_${name}_id_foreign`,
                table: name3,
                column: `${name}_id`,
                foreign_key_schema: "public",
                foreign_key_table: name,
                foreign_key_column: "id",
                on_update: "NO ACTION",
                on_delete: "CASCADE",
            },
            meta: {
                many_collection: name3,
                many_field: `${name}_id`,
                one_collection: name,
                one_field: "components",
                one_collection_field: null,
                one_allowed_collections: null,
                junction_field: "item",
                sort_field: "sort",
                one_deselect_action: "nullify",
            },
        }),
    );

    await client.request(
        createRelation({
            collection: name3,
            field: "item",
            related_collection: null,
            schema: null,
            meta: {
                many_collection: name3,
                many_field: "item",
                one_collection: null,
                one_field: null,
                one_collection_field: "collection",
                one_allowed_collections: [
                    "website_component_single_text",
                    "website_component_dual_text",
                    "website_component_image_text",
                    "website_component_event",
                    "website_component_news_article",
                    "website_component_downloads",
                    "website_component_job_listing",
                    "website_component_photo_gallery",
                    "website_component_youtube_video",
                    "website_component_cta",
                    "website_component_listing",
                    "website_component_qa",
                    "website_component_custom",
                    "website_component_blog_post",
                    "website_component_link",
                    "website_component_links",
                ],
                junction_field: `${name}_id`,
                sort_field: null,
                one_deselect_action: "nullify",
            },
        }),
    );

    console.log(`Creating pages collections... Done.`);
}
