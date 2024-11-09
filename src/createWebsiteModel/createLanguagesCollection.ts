import {
    createCollection,
    createField,
    createRelation,
    deleteRelation,
    type DirectusCollection,
} from "@directus/sdk";
import { getFieldRecipe } from "./fieldRecipes";
import { getRelationRecipe } from "./relationRecipes";

export async function createLanguagesCollection(
    client: RefDirectusClient,
    namespace: string,
    folder: DirectusCollection,
) {
    console.log(`Creating languages collection...`);

    const name = `${namespace}_languages`;
    await client.request(
        createCollection({
            collection: name,
            meta: {
                collection: name,
                icon: null,
                note: null,
                display_template: "{{status}}{{code}}",
                hidden: false,
                singleton: false,
                translations: [
                    {
                        language: "en-US",
                        translation: "Languages",
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
            collection: name,
            field: "code",
            type: "string",
            schema: {
                data_type: "character varying",
            },
            meta: {
                required: true,
            },
        },
        {
            collection: name,
            field: "name",
            type: "string",
            schema: {
                data_type: "character varying",
            },
        },
        {
            collection: name,
            field: "direction",
            type: "string",
            schema: {
                data_type: "character varying",
                default_value: "ltr",
            },
            meta: {
                interface: "select-dropdown",
                options: {
                    choices: [
                        {
                            text: "ltr",
                            value: "ltr",
                        },
                        {
                            text: "rtl",
                            value: "rtl",
                        },
                    ],
                },
            },
        },
        {
            collection: name,
            field: "is_default",
            type: "boolean",
            schema: {
                default_value: false,
            },
            meta: {
                special: ["cast-boolean"],
                interface: "boolean",
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
    } catch (e) {}

    await client.request(
        createRelation(getRelationRecipe("userCreated", { collection: name })!),
    );
    await client.request(
        createRelation(getRelationRecipe("userUpdated", { collection: name })!),
    );

    console.log(`Creating languages collection... Done.`);
}
