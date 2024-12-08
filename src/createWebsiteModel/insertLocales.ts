import { createItems, readItems, updateItems } from "@directus/sdk";

export async function insertLocales(
    client: RefDirectusClient,
    namespace: string,
    supportedLocales: string[],
    owner?: string,
): Promise<LanguagesCollection[]> {
    console.log(`Inserting locales...`);

    const name = `${namespace}_languages` as "languages";

    try {
        const existingItems = await client.request(readItems(name));
        const updatedData = supportedLocales
            .filter((lo) => !existingItems.some((item) => item["code"] === lo))
            .map((lo) => ({
                status: "published",
                code: lo,
                name: lo,
                direction: "ltr" as "ltr",
                is_default: supportedLocales[0] === lo,
            }));

        if (updatedData.length === 0) {
            if (owner) {
                const ids = (existingItems as { id: number }[]).map(
                    (item) => item.id,
                );
                await client.request(
                    updateItems(name, ids, { user_created: owner }),
                );
            }
            console.log(`Inserting locales: items already exists.`);
            return existingItems;
        }

        try {
            const items = await client.request(createItems(name, updatedData));

            if (owner) {
                const ids = (items as { id: number }[]).map((item) => item.id);
                await client.request(
                    updateItems(name, ids, { user_created: owner }),
                );
            }

            console.log(`Inserting locales... Done.`);

            return existingItems.concat(items);
        } catch (e) {
            throw new Error(`Inserting locales: Failed to create items.`, {
                cause: e,
            });
        }
    } catch (e) {
        throw new Error(`Inserting locales: Failed to check items.`, {
            cause: e,
        });
    }
}
