import { getDirectusClient } from "../lib/getDirectusClient";
import { createLanguagesCollection } from "./createLanguagesCollection";
import { createSettingsCollection } from "./createSettingsCollection";
import { createMessageCatalogCollection } from "./createMessageCatalogCollection";
import { verifyPublicFolder } from "./verifyPublicFolder";
import { verifyProjectFolder } from "./verifyProjectFolder";
import { insertLocales } from "./insertLocales";
import { createPagesCollection } from "./createPagesCollection";
import { createAccessPolicy } from "./createAccessPolicy";
import { configureSlugifyFlow } from "./configureSlugifyFlow";
import { insertSettings } from "./insertSettings";
import { insertDefaultMessageCatalog } from "./insertDefaultMessageCatalog";

export async function createWebsiteModel(options: CreateWebsiteModelCmdOpts) {
    console.log(`Creating website model.`);

    const collections = [
        `${options.namespace}_languages`,
        `${options.namespace}_settings`,
        `${options.namespace}_message_catalog`,
        `${options.namespace}_message_catalog_translations`,
        `${options.namespace}_pages`,
        `${options.namespace}_pages_translations`,
        `${options.namespace}_pages_components`,
    ];

    const client = await getDirectusClient();
    const publicFolder = await verifyPublicFolder(client);
    const projectFolder = await verifyProjectFolder(client, options.namespace);
    await createLanguagesCollection(client, options.namespace, projectFolder);
    await createSettingsCollection(client, options.namespace, projectFolder);
    await createMessageCatalogCollection(
        client,
        options.namespace,
        projectFolder,
        publicFolder,
    );
    await createPagesCollection(
        client,
        options.namespace,
        projectFolder,
        publicFolder,
    );

    await createAccessPolicy(client, options.namespace, collections);
    await configureSlugifyFlow(
        client,
        `${options.namespace}_pages_translations`,
    );

    const savedLocales = await insertLocales(
        client,
        options.namespace,
        options.supportedLocales,
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
