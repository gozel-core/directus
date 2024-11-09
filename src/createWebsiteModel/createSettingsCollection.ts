import {
    createCollection,
    createField,
    createRelation,
    deleteRelation,
    type DirectusCollection,
} from "@directus/sdk";
import { getFieldRecipe } from "./fieldRecipes";
import { getRelationRecipe } from "./relationRecipes";

export async function createSettingsCollection(
    client: RefDirectusClient,
    namespace: string,
    folder: DirectusCollection,
) {
    console.log(`Creating settings collection...`);

    const name = `${namespace}_settings` as keyof RefSchema;
    await client.request(
        createCollection({
            collection: name,
            meta: {
                collection: name,
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
            field: "maintenance_mode",
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
                field: "maintenance_mode",
                special: ["cast-boolean"],
                interface: "boolean",
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
                required: false,
                group: null,
                validation: null,
                validation_message: null,
            },
        },
        {
            field: "search_engine_indexing",
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
                field: "search_engine_indexing",
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

    console.log(`Creating languages collection... Done.`);
}
