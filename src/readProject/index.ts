import { verifyStoreDir } from "../sync/verifyStoreDir";
import path from "node:path";
import { DEPLOY_MANIFEST_FILENAME } from "../constants";
import { getExecutionDir } from "../lib/getExecutionDir";
import { expandRoutes } from "./expandRoutes";
import { readData } from "./readData";
import { deployManifest } from "../sync/deployManifest";

export async function readProject(opts: ReadProjectCmdOpts) {
    console.log(`Reading project "${opts.project}"...`);

    const execDir = getExecutionDir();
    const storePath = await verifyStoreDir(opts.store, opts.project);
    await deployManifest.load(path.join(storePath, DEPLOY_MANIFEST_FILENAME));
    const data = await readData();
    await expandRoutes(storePath, data, execDir, opts.project);

    console.log(`Reading project "${opts.project}"... Done.`);
}
