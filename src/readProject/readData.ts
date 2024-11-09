import { fsUtil } from "@gozel-core/standard-js-backend";
import { deployManifest } from "../sync/deployManifest";

export async function readData(): Promise<Record<string, unknown>> {
    return await Object.keys(deployManifest.assets)
        .filter((k) =>
            typeof deployManifest.assets[k] === "string"
                ? deployManifest.assets[k].startsWith("/") &&
                  deployManifest.assets[k].endsWith("json")
                : false,
        )
        .reduce(async (memo, k) => {
            return {
                ...(await memo),
                [k]: await fsUtil.readJsonFile(deployManifest.assets[k]!),
            };
        }, {});
}
