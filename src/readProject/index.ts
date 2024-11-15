import { verifyStoreDir } from "../sync/verifyStoreDir";
import path from "node:path";
import { DEPLOY_MANIFEST_FILENAME } from "../constants";
import { getExecutionDir } from "../lib/getExecutionDir";
import { expandRoutes } from "./expandRoutes";
import { readData } from "./readData";
import { deployManifest } from "../sync/deployManifest";
import { copyMedia } from "./copyMedia";
import { copyWebsiteData } from "./copyWebsiteData";
import { copyEssentialData } from "./copyEssentialData";

export async function readProject(opts: ReadProjectCmdOpts) {
    console.log(`Reading project "${opts.project}"...`);

    opts.savePath = opts.savePath.replace("[project]", opts.project);

    const execDir = getExecutionDir();
    const storePath = await verifyStoreDir(opts.store, opts.project);
    await deployManifest.load(path.join(storePath, DEPLOY_MANIFEST_FILENAME));
    const data = await readData();
    await expandRoutes(data, execDir, opts.project, opts.savePath);
    await copyMedia(storePath, opts.staticPath);
    await copyEssentialData(storePath, opts.savePath);
    await copyWebsiteData(storePath, opts.staticPath);

    console.log(`Reading project "${opts.project}"... Done.`);
}
