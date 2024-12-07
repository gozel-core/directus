import { readFlows, updateFlow } from "@directus/sdk";

export async function configureSlugifyFlow(
    client: RefDirectusClient,
    collection: string,
) {
    console.log(`Configure slugify flow...`);

    const name = "slugify";
    const flows = await client.request(readFlows());
    const hasSlugifyFlow = flows.some(
        (flow) => flow.name.toLowerCase() === name.toLowerCase(),
    );

    if (!hasSlugifyFlow) {
        console.log(`The slugify flow not found, therefore skipping.`);
        return;
    }

    const flow = flows.find(
        (flow) => flow.name.toLowerCase() === name.toLowerCase(),
    );

    if (!flow || !flow.options) {
        console.log(`Configure slugify flow: no appropriate flow found.`);
        return;
    }

    const existingCollections = flow.options["collections"] as string[];

    if (existingCollections.includes(collection)) {
        console.log(`Configure slugify flow: already configured.`);
        return;
    }

    const updatedCollections = existingCollections.concat([collection]);

    await client.request(
        updateFlow(
            flow.id,
            // @ts-ignore
            Object.assign({}, flow, {
                options: Object.assign({}, flow.options, {
                    collections: updatedCollections,
                }),
            }),
        ),
    );

    console.log(`Configure slugify flow... Done.`);
}
