import { createFolder, type DirectusFolder, readFolders } from "@directus/sdk";

export async function verifyPublicFolder(
    client: RefDirectusClient,
): Promise<DirectusFolder> {
    console.log(`Verifying public upload folder...`);

    const name = "public"; //`${namespace}_public`
    const folders = await client.request(readFolders({ fields: ["*"] }));
    const exists = folders.some((f) => f.name === name);

    if (exists) {
        console.log(`Verifying public upload folder... Done.`);
        return folders.find((f) => f.name === name)!;
    }

    try {
        const result = await client.request(
            createFolder({
                name,
            }),
        );

        console.log(`Verifying public upload folder... Done.`);

        return result;
    } catch (e) {
        console.log(`Verifying public upload folder... Failed.`);
        throw new Error(`Failed to create public folder on directus.`, {
            cause: e,
        });
    }
}
