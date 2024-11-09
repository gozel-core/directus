import { writeFile } from "node:fs/promises";
import { fsUtil } from "@standard/backend";

const keysToExclude = ["save", "load"];

export const deployManifest: DeployManifest = {
    relationalFields: {
        mediaFields: [],
        htmlFields: [],
        m2aFields: [],
        m2mFields: [],
        m2oFields: [],
        o2mFields: [],
    },

    assets: {},

    save: async function save(filepath: string) {
        const data = Object.keys(this)
            .filter((k) => !keysToExclude.includes(k))
            .reduce((memo: Record<string, unknown>, k) => {
                memo[k] = this[k];
                return memo;
            }, {});
        await writeFile(filepath, JSON.stringify(data, null, 4));
    },

    load: async function load(filepath: string) {
        const data = await fsUtil.readJsonFile(filepath);

        Object.keys(data)
            .filter((k) => !keysToExclude.includes(k))
            .map((k) => (this[k] = data[k as keyof typeof data]));
    },
};
