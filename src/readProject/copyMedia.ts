import * as path from "node:path";
import { cp } from "node:fs/promises";
import { fsUtil } from "@gozel-core/standard-js-backend";
import { MEDIA_DIR_NAME } from "../constants";
import { getExecutionDir } from "../lib/getExecutionDir";

export async function copyMedia(storePath: string, staticPath: string) {
    const mediaPath = path.join(storePath, MEDIA_DIR_NAME);
    const execDir = getExecutionDir();
    const dest = path.join(execDir, staticPath, "media");

    await fsUtil.verifyDir(path.join(execDir, staticPath));
    await cp(mediaPath + "/", dest, {
        force: true,
        preserveTimestamps: true,
        recursive: true,
    });
}
