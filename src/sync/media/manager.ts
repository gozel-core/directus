import {
    type DirectusFile,
    type DirectusSettings,
    readAssetArrayBuffer,
    readFiles,
} from "@directus/sdk";
import * as path from "node:path";
import { fsUtil } from "@gozel-core/standard-js-backend";
import { MEDIA_DIR_NAME, MEDIA_MANIFEST_FILENAME } from "../../constants";
import { sync } from "./sync";
import { MediaManifest } from "./manifest";
import { deployManifest } from "../deployManifest";

export async function initMediaManager(
    storePath: string,
    client: RefDirectusClient,
    model: RefDataModel,
    dataAnalysis: DataAnalysis,
    deploySettings: DeploySettings,
) {
    console.log(`Media manager init.`);

    console.log(`Fetching file entries.`);
    // fetch file entries
    // add `{ filter: { folder: { _eq: "" } } }` if you want to filter by folder
    const allFiles = (await client.request(readFiles())) as DirectusFile[];
    const files = allFiles.filter(({ id }) =>
        dataAnalysis.mediaIds.includes(id),
    );

    console.log(`Verifying media path.`);
    const mediaPath = path.join(storePath, MEDIA_DIR_NAME);
    await fsUtil.verifyDir(mediaPath, true);

    console.log(`Verifying media manifest file.`);
    const manifestFile = path.join(storePath, MEDIA_MANIFEST_FILENAME);
    const manifest = new MediaManifest(
        manifestFile,
        mediaPath,
        downloadAssetAsArrayBuffer,
    );

    deployManifest.assets["mediaManifest"] = manifestFile;

    await manifest.init();

    console.log(`Synchronise entries with the file system.`);
    if (!deploySettings.media_presets) {
        throw new Error(`Missing media presets in deploy settings.`);
    }
    const mediaPresets = model.directusSettings
        .storage_asset_presets!.map(({ key }) => key)
        .filter((key) => deploySettings.media_presets.includes(key));
    await sync(
        manifest,
        dataAnalysis.mediaIds,
        model.directusSettings.storage_asset_presets!.filter(({ key }) =>
            mediaPresets.includes(key),
        ),
        files,
    );

    return {
        manifest,
    };

    async function downloadAssetAsArrayBuffer(
        id: string,
        preset?: NonNullable<DirectusSettings["storage_asset_presets"]>[0],
    ) {
        return await client.request(
            readAssetArrayBuffer(id, preset ? { key: preset.key } : {}),
        );
    }
}
