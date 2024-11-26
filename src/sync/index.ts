import * as path from "node:path";
import { getDirectusClient } from "../lib/getDirectusClient";
import { fetchDeploySettings } from "../lib/fetchDeploySettings";
import { verifyStoreDir } from "./verifyStoreDir";
import { fetchModel } from "./model/fetch";
import { fetchData } from "./data/fetch";
import { analyseModel } from "./model/analyse";
import { analyseData } from "./data/analyse";
import { initMediaManager } from "./media/manager";
import { formatData } from "./data/format";
import { createWebsiteData } from "./data/website";
import { genCollectionNames } from "../lib/genCollectionNames";
import { DEPLOY_MANIFEST_FILENAME } from "../constants";
import { deployManifest } from "./deployManifest";

export async function sync(opts: SyncCmdOpts) {
    console.log(`Directus sync began.`);

    if (!process.env.APP_URL)
        throw new Error("The env var APP_URL needs to be set.");

    const client = await getDirectusClient();
    const deploySettings = await fetchDeploySettings(client, opts.project);
    const collectionNames = genCollectionNames(
        deploySettings.table_prefix ?? "",
        deploySettings.collections ?? [],
    );
    const storePath = await verifyStoreDir(opts.store, opts.project);
    const model = await fetchModel(client, collectionNames);
    const modelAnalysis = analyseModel(model, collectionNames);
    const data = await fetchData(client, model);
    const dataAnalysis = analyseData(data, modelAnalysis);
    const _mediaManager = await initMediaManager(
        storePath,
        client,
        model,
        dataAnalysis,
        deploySettings,
    );
    const _formattedData = await formatData(
        storePath,
        collectionNames,
        model,
        modelAnalysis,
        data,
        deploySettings.table_prefix ?? "",
    );
    await createWebsiteData(
        storePath,
        deploySettings,
        collectionNames,
        model,
        modelAnalysis,
        data,
        dataAnalysis,
    );
    deployManifest["namespace"] = deploySettings.table_prefix ?? "";
    await deployManifest.save(path.join(storePath, DEPLOY_MANIFEST_FILENAME));

    console.log(`Directus sync done.`);
}
