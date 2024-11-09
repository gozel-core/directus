import { readItem } from "@directus/sdk";
import { DEPLOY_SETTINGS_TABLE_NAME } from "../constants";

export async function fetchDeploySettings(
    client: RefDirectusClient,
    project: string,
) {
    console.log(`Fetching deploy settings for the project:${project}`);

    try {
        const fetchResult = await client.request(
            readItem(DEPLOY_SETTINGS_TABLE_NAME, project),
        );

        console.log(JSON.stringify(fetchResult, null, 4));
        console.log("");

        return fetchResult;
    } catch (e) {
        throw new Error(`Failed to fetch deploy settings.`, { cause: e });
    }
}
