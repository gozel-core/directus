import * as path from "node:path";
import { copyFile, readdir } from "node:fs/promises";
import { getExecutionDir } from "../lib/getExecutionDir";

export async function copyWebsiteData(storePath: string, staticPath: string) {
    const execDir = getExecutionDir();
    const dest = path.join(execDir, staticPath);

    const jobs = (await readdir(storePath + "/"))
        .filter(
            (name) => name.includes("robots.txt") || name.includes("sitemap."),
        )
        .map((name) =>
            copyFile(path.join(storePath, name), path.join(dest, name)),
        );
    return await Promise.all(jobs);
}
