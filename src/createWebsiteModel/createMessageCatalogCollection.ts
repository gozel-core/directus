import {
    createCollection,
    createField,
    createRelation,
    deleteRelation,
    type DirectusCollection,
    type DirectusFolder,
} from "@directus/sdk";
import { getFieldRecipe } from "./fieldRecipes";
import { getRelationRecipe } from "./relationRecipes";

export async function createMessageCatalogCollection(
    client: RefDirectusClient,
    namespace: string,
    folder: DirectusCollection,
    publicFolder: DirectusFolder,
) {
    console.log(`Creating message catalog collections...`);

    const name = `${namespace}_message_catalog` as keyof RefSchema;
    await client.request(
        createCollection({
            collection: name,
            meta: {
                collection: name,
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
                name: name,
                comment: null,
            },
        }),
    );

    const fields = [
        getFieldRecipe("userCreated", { collection: name }),
        getFieldRecipe("dateCreated", { collection: name }),
        getFieldRecipe("userUpdated", { collection: name }),
        getFieldRecipe("dateUpdated", { collection: name }),
        {
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
        {
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
    ];

    for (const f of fields) {
        if (!f) continue;
        try {
            await client.request(createField(name, f));
        } catch (e) {
            throw new Error("Failed to create field.", { cause: e });
        }
    }

    try {
        await client.request(deleteRelation(name, "user_created"));
        await client.request(deleteRelation(name, "user_updated"));
    } catch (e) {}

    await client.request(
        createRelation(getRelationRecipe("userCreated", { collection: name })!),
    );
    await client.request(
        createRelation(getRelationRecipe("userUpdated", { collection: name })!),
    );

    const name2 =
        `${namespace}_message_catalog_translations` as keyof RefSchema;
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
        {
            field: "enable_html",
            type: "boolean",
            schema: {
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
                field: "enable_html",
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
        {
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
                            toolbar: [
                                "bold",
                                "italic",
                                "underline",
                                "h1",
                                "h2",
                                "h3",
                                "numlist",
                                "bullist",
                                "removeformat",
                                "blockquote",
                                "customLink",
                                "customImage",
                                "customMedia",
                                "hr",
                                "code",
                                "fullscreen",
                            ],
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
    ];

    for (const f of fields2) {
        if (!f) continue;
        try {
            await client.request(createField(name2, f));
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

    console.log(`Creating message catalog collections... Done.`);
}
