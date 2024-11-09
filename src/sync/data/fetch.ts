import {
    readSingleton,
    readItems,
    type DirectusCollection,
    type DirectusField,
} from "@directus/sdk";

export async function fetchData(
    client: RefDirectusClient,
    model: RefDataModel,
): Promise<RefData> {
    console.log(`Fetching items`);

    const result = await model.collections.reduce(async (acc, collection) => {
        const name = collection.collection;
        const isSingleton = collection.meta.singleton;

        if (isSingleton) {
            try {
                const data = await client.request(
                    readSingleton(name as "singleton"),
                );
                return { ...(await acc), [name]: data };
            } catch (e) {
                throw new Error(`Failed to fetch data from "${name}"`, {
                    cause: e,
                });
            }
        } else {
            try {
                const query = createReadItemsQuery(collection, model.fields);
                const data = await client.request(
                    readItems(name as "items", query),
                );
                return { ...(await acc), [name]: data };
            } catch (e) {
                throw new Error(`Failed to fetch data from "${name}"`, {
                    cause: e,
                });
            }
        }
    }, {});

    console.log(
        Object.keys(result)
            .map((collectionName) => collectionName)
            .join(", "),
    );

    return result;
}

function createReadItemsQuery(
    collection: DirectusCollection,
    fields: DirectusField[],
) {
    const sortField = collection.meta.sort_field;
    const archiveField = collection.meta.archive_field;
    const dateCreatedField = fields.find(
        (f) =>
            f.collection === collection.collection &&
            f.meta.special &&
            f.meta.special.includes("date-created"),
    );
    const primaryKeyField = fields.find(
        (f) =>
            f.collection === collection.collection &&
            f.schema &&
            f.schema.is_primary_key,
    );
    const itemsQuery: CustomQueryObject = {
        fields: ["*"],
        filter: {},
        sort: [],
    };
    if (archiveField) itemsQuery.filter[archiveField] = { _eq: "published" };
    if (sortField) itemsQuery.sort.push(sortField);
    if (dateCreatedField) itemsQuery.sort.push(`-${dateCreatedField["field"]}`);
    if (primaryKeyField) itemsQuery.sort.push(primaryKeyField["field"]);

    return itemsQuery;
}

interface CustomQueryObject {
    fields: string[];
    filter: Record<string, Record<string, string>>;
    sort: string[];
}
