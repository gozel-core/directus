import { getDirectusClient } from "../lib/getDirectusClient";
import { verifyPublicFolder } from "./verifyPublicFolder";
import { verifyProjectFolder } from "./verifyProjectFolder";
import { insertLocales } from "./insertLocales";
import { createAccessPolicy } from "./createAccessPolicy";
import { configureSlugifyFlow } from "./configureSlugifyFlow";
import { insertSettings } from "./insertSettings";
import { insertDefaultMessageCatalog } from "./insertDefaultMessageCatalog";
import { createCollections } from "./createCollections";
import { readCollections } from "@directus/sdk";

export async function createWebsiteModel(options: CreateWebsiteModelCmdOpts) {
    console.log(`Creating website model.`);

    const client = await getDirectusClient();
    const existingCollections = await client.request(readCollections());
    const publicFolder = await verifyPublicFolder(client);
    const projectFolder = await verifyProjectFolder(
        client,
        options.namespace,
        existingCollections,
    );

    await createCollections(
        client,
        options.namespace,
        projectFolder,
        publicFolder,
        existingCollections,
    );
    await createAccessPolicy(client, options.namespace);
    await configureSlugifyFlow(
        client,
        `${options.namespace}_pages_translations`,
    );

    const savedLocales = await insertLocales(
        client,
        options.namespace,
        options.supportedLocale,
        options.owner,
    );
    await insertSettings(client, options.namespace, options.owner);
    await insertDefaultMessageCatalog(
        client,
        options.namespace,
        savedLocales,
        options.owner,
    );

    console.log(`Creating website model. Done.`);
}
