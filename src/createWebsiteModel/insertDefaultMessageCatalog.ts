import defaultMessageCatalog from "./defaultMessageCatalog.json";
import { createItems, readItems, updateItems } from "@directus/sdk";

export async function insertDefaultMessageCatalog(
    client: RefDirectusClient,
    namespace: string,
    savedLocales: LanguagesCollection[],
    owner?: string,
) {
    console.log(`Inserting default message catalog...`);

    const name = `${namespace}_message_catalog` as "message_catalog";
    const existingMessages = await client.request(readItems(name));
    const existingKeys = existingMessages.map(({ key }) => key);
    const keysToSave = Object.keys(defaultMessageCatalog).filter(
        (key) => !existingKeys.includes(key),
    );

    if (keysToSave.length === 0) {
        console.log(`Inserting default message catalog: items already exists.`);
        return existingMessages;
    }

    let savedItems: MessageCatalogCollection[] = [];

    try {
        const items = keysToSave.map((key) => ({ key }));
        savedItems = await client.request(createItems(name, items));

        if (owner) {
            const ids = savedItems.map(({ id }) => id);
            await client.request(
                updateItems(name, ids, { user_created: owner }),
            );
        }
    } catch (e) {
        throw new Error(
            `Inserting default message catalog: Failed to create items.`,
            { cause: e },
        );
    }

    const name2 =
        `${namespace}_message_catalog_translations` as "message_catalog_translations";

    let savedTItems: Partial<MessageCatalogTranslationCollection>[] = [];

    try {
        const items = savedItems.reduce(
            (memo: Partial<MessageCatalogTranslationCollection>[], item) => {
                return memo.concat(
                    savedLocales.map((obj) => ({
                        [`${namespace}_message_catalog_id`]: item.id,
                        [`${namespace}_languages_id`]: obj.id,
                        plain_text: defaultMessageCatalog[
                            item.key as keyof typeof defaultMessageCatalog
                        ][obj.code as "en-US"] as string,
                    })),
                );
            },
            [],
        );

        savedTItems = await client.request(createItems(name2, items));

        if (owner) {
            const ids = savedTItems.map(({ id }) => id!);
            await client.request(
                updateItems(name2, ids, { user_created: owner }),
            );
        }
    } catch (e) {
        throw new Error(
            `Inserting default message catalog: Failed to create translation items.`,
            { cause: e },
        );
    }

    console.log(`Inserting default message catalog... Done.`);

    return savedItems;
}
