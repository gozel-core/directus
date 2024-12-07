import {
    createCollection,
    createField,
    createRelation,
    deleteRelation,
    type DirectusCollection,
    type DirectusFolder,
} from "@directus/sdk";
import { collections } from "./domains/index";

export async function createCollections(
    client: RefDirectusClient,
    namespace: string,
    folder: DirectusCollection,
    publicFolder: DirectusFolder,
    existingCollections: DirectusCollection[],
) {
    console.log(`Creating collections...`);

    const collectionsToExclude: (keyof RefSchema)[] = [];

    for (const name of Object.keys(collections)) {
        const ops = collections[name as keyof typeof collections].getRecipe(
            namespace,
            folder,
            publicFolder,
        );
        await executeOps(ops);
    }

    async function executeOps(ops: Operation[]) {
        let currentCollection: keyof RefSchema | null = null;
        for (const op of ops) {
            if (op.name === "CREATE_COLLECTION") {
                currentCollection = op.recipe.collection! as keyof RefSchema;
                if (
                    existingCollections.some(
                        (ec) => ec.collection === currentCollection,
                    )
                )
                    collectionsToExclude.push(currentCollection);
                if (collectionsToExclude.includes(currentCollection)) continue;
                await client.request(createCollection(op.recipe));
            } else if (op.name === "CREATE_FIELD") {
                if (
                    currentCollection &&
                    collectionsToExclude.includes(currentCollection)
                )
                    continue;
                await client.request(
                    createField(currentCollection!, op.recipe),
                );
            } else if (op.name === "DELETE_RELATION") {
                if (
                    currentCollection &&
                    collectionsToExclude.includes(currentCollection)
                )
                    continue;
                try {
                    await client.request(
                        deleteRelation(currentCollection!, op.recipe.field),
                    );
                } catch (e) {}
            } else if (op.name === "CREATE_RELATION") {
                if (
                    currentCollection &&
                    collectionsToExclude.includes(currentCollection)
                )
                    continue;
                await client.request(createRelation(op.recipe));
            }

            await wait(300);
        }
    }
}

async function wait(timeout: number) {
    return new Promise((res) => setTimeout(() => res(undefined), timeout));
}
