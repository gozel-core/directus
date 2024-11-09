import {
    createCollection,
    type DirectusCollection,
    readCollections,
} from "@directus/sdk";

export async function verifyProjectFolder(
    client: RefDirectusClient,
    namespace: string,
): Promise<DirectusCollection<RefSchema>> {
    console.log(`Verifying project folder...`);

    const list = await client.request(readCollections());
    const has = list.some(({ collection }) => collection === namespace);

    if (has) {
        console.log(`Verifying project folder... Done.`);

        return list.find(({ collection }) => collection === namespace)!;
    }

    const config = {
        collection: namespace,
        meta: {
            collection: namespace,
            icon: "folder",
            note: null,
            display_template: null,
            hidden: false,
            singleton: false,
            translations: [],
            archive_field: null,
            archive_app_filter: true,
            archive_value: null,
            unarchive_value: null,
            sort_field: null,
            accountability: "all",
            color: null,
            item_duplication_fields: null,
            group: null,
            collapse: "open",
            preview_url: null,
            versioning: false,
        },
        schema: null,
    };

    try {
        const result = await client.request(createCollection(config));

        console.log(`Verifying project folder... Done.`);

        return result;
    } catch (e) {
        console.log(`Verifying project folder... Failed.`);
        throw new Error(`Failed to create project folder on directus.`, {
            cause: e,
        });
    }
}
