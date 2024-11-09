import { createItem, updateItem } from "@directus/sdk";

export async function insertSettings(
    client: RefDirectusClient,
    namespace: string,
    owner: string,
) {
    console.log(`Inserting settings...`);

    const name = `${namespace}_settings` as keyof RefSchema;
    const data: Record<string, unknown> = {
        maintenance_mode: false,
        search_engine_indexing: true,
    };

    try {
        const item = await client.request(createItem(name, data));
        const id = (item as { id: number }).id;

        if (owner) {
            await client.request(updateItem(name, id, { user_created: owner }));
        }

        console.log(`Inserting settings... Done.`);

        return item;
    } catch (e) {
        throw new Error(`Inserting settings: Failed to create items.`, {
            cause: e,
        });
    }
}
