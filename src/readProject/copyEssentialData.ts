import path from "node:path";
import { writeFile } from "node:fs/promises";
import { fsUtil } from "@gozel-core/standard-js-backend";
import { getExecutionDir } from "../lib/getExecutionDir";
import { deployManifest } from "../sync/deployManifest";

export async function copyEssentialData(storePath: string, savePath: string) {
    const execDir = getExecutionDir();
    const dest = path.join(execDir, savePath);
    const namespace = deployManifest["namespace"] as string;

    const businessesFile = path.join(storePath, `businesses.json`);
    if (await fsUtil.isFileExists(businessesFile)) {
        const businesses = (await fsUtil.readJsonFile(
            businessesFile,
        )) as Business[];
        const _business = businesses.map((b) => {
            const {
                id,
                user_created,
                user_updated,
                date_created,
                date_updated,
                ...business
            } = b;
            return business;
        });
        await writeFile(
            path.join(dest, "business.json"),
            JSON.stringify(_business),
        );
    }

    const settingsFile = path.join(storePath, `${namespace}_settings.json`);
    if (await fsUtil.isFileExists(settingsFile)) {
        const {
            id,
            user_created,
            user_updated,
            date_created,
            date_updated,
            ...settings
        } = (
            (await fsUtil.readJsonFile(settingsFile)) as unknown as Settings[]
        )[0]!;
        await writeFile(
            path.join(dest, "settings.json"),
            JSON.stringify(settings),
        );
    }

    const languagesFile = path.join(storePath, `${namespace}_languages.json`);
    const languages = (
        (await fsUtil.isFileExists(languagesFile))
            ? await fsUtil.readJsonFile(languagesFile)
            : []
    ) as Language[];
    if (languages.length > 0) {
        const _languages = languages.map((l) => {
            const {
                id,
                user_created,
                user_updated,
                date_created,
                date_updated,
                ...language
            } = l;
            return language;
        });
        await writeFile(
            path.join(dest, `languages.json`),
            JSON.stringify(_languages),
        );
    }

    const msgsFile = path.join(storePath, `${namespace}_message_catalog.json`);
    if (await fsUtil.isFileExists(msgsFile)) {
        const msgs = (await fsUtil.readJsonFile(msgsFile)) as Message[];
        const jobs = languages.map(async ({ code, id }) => {
            const data = msgs.reduce((memo: Record<string, string>, msg) => {
                const predicate = (msgt: MessageTranslation) =>
                    (msgt[
                        deployManifest["translationJunctionField"]!
                    ] as unknown as number) === id;
                memo[msg.key] =
                    msg.translations.find(predicate)?.plain_text ?? "";
                return memo;
            }, {});
            await writeFile(
                path.join(dest, `messageCatalog-${code}.json`),
                JSON.stringify(data),
            );
        });
        await Promise.all(jobs);
    }
}

interface Settings {
    id: string;
    user_created: string;
    user_updated: string;
    date_created: string;
    date_updated: string;
    [index: string]: unknown;
}

interface Language {
    id: number;
    user_created: string;
    user_updated: string;
    date_created: string;
    date_updated: string;
    code: string;
    name: string;
    is_default: boolean;
}

interface Message {
    key: string;
    translations: MessageTranslation[];
    [index: string]: unknown;
}

interface MessageTranslation {
    plain_text: string;
    enable_html: boolean;
    html_text: string;
    [index: string]: unknown;
}

interface Business {
    name: string;
    [index: string]: unknown;
}
