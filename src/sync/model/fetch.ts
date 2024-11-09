import {
    type DirectusCollection,
    type DirectusField,
    type DirectusSettings,
    readCollections,
    readFields,
    readRelations,
    readSettings,
} from "@directus/sdk";
import type { genCollectionNames } from "../../lib/genCollectionNames";

export async function fetchModel(
    client: RefDirectusClient,
    collectionNames: ReturnType<typeof genCollectionNames>,
): Promise<RefDataModel> {
    console.info(`Fetching model.`);

    const refCollections = Object.values(collectionNames);
    const allRelations = await client.request(readRelations());
    const m2aCollections = allRelations
        .filter(
            (relation) =>
                relation.meta &&
                relation.meta.one_allowed_collections &&
                relation.field === "item" &&
                refCollections.includes(relation.collection),
        )
        .reduce(
            (memo: string[], relation) =>
                memo.concat(
                    relation.meta
                        .one_allowed_collections as unknown as string[],
                ),
            [],
        )
        .filter((name, i, self) => self.indexOf(name) === i);
    // exclude irrelevant relations
    const relations = allRelations.filter(
        (relation) =>
            refCollections.includes(relation.collection) ||
            refCollections.includes(relation.related_collection) ||
            m2aCollections.includes(relation.related_collection) ||
            m2aCollections.includes(relation.related_collection),
    );
    const _relatedCollections1 = relations
        .filter((relation) => !refCollections.includes(relation.collection))
        .map((relation) => relation.collection);
    const _relatedCollections2 = relations
        .filter(
            (relation) => !refCollections.includes(relation.related_collection),
        )
        .map((relation) => relation.related_collection);
    const relatedCollections = _relatedCollections1
        .concat(_relatedCollections2)
        .filter((name, i, self) => self.indexOf(name) === i);
    const allCollections = (await client.request(
        readCollections(),
    )) as DirectusCollection[];
    const systemCollections = allCollections
        // @ts-ignore
        .filter(({ meta }) => meta.system);
    // exclude system tables and irrelevant tables to the project
    const collections = allCollections
        .filter(
            (collection) =>
                !Object.hasOwn(collection.meta ?? {}, "system") &&
                collection["schema"] !== null,
        )
        .filter(
            ({ collection }) =>
                relatedCollections.includes(collection) ||
                refCollections.includes(collection) ||
                m2aCollections.includes(collection),
        );
    console.log(
        `Collections (${collections.length}): ${collections.map(({ collection }) => collection).join(", ")}`,
    );

    const allFields = (await client.request(readFields())) as DirectusField[];
    const _collectionNames = collections.map(({ collection }) => collection);
    const fields = allFields.filter((field) =>
        _collectionNames.includes(field.collection),
    );

    const directusSettings = (await client.request(
        readSettings(),
    )) as DirectusSettings;
    console.log(`Directus settings:`);
    console.log(directusSettings);

    return {
        allCollections,
        systemCollections,
        collections,
        relations,
        fields,
        directusSettings,
    };
}
