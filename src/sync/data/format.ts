import { writeFile } from "node:fs/promises";
import * as path from "node:path";
import type { genCollectionNames } from "../../lib/genCollectionNames";
import { deployManifest } from "../deployManifest";
import {
    extractRawCollectionName,
    camelCaseCollectionName,
} from "../../lib/util";

export async function formatData(
    storePath: string,
    collectionNames: ReturnType<typeof genCollectionNames>,
    model: RefDataModel,
    modelAnalysis: ModelAnalysis,
    data: RefData,
    namespace: string,
) {
    const refCollections = model.collections.map(
        ({ collection }) => collection,
    ); // Object.values(collectionNames);

    return Object.keys(data)
        .filter((collectionName) => refCollections.includes(collectionName))
        .reduce(async (memo, collectionName) => {
            const collectionData = data[collectionName]!;
            const specialFields = scopeModelAnalysis(
                modelAnalysis,
                collectionName,
            );
            if (isSingleton(collectionData)) {
                const formatted = await formatItem(
                    data,
                    collectionData,
                    specialFields,
                );
                const filepath = path.join(storePath, collectionName + ".json");
                await writeFile(filepath, JSON.stringify(formatted));

                deployManifest.assets[
                    camelCaseCollectionName(
                        extractRawCollectionName(collectionName, namespace),
                    )
                ] = filepath;

                return { ...(await memo), [collectionName]: formatted };
            } else {
                const formatted = await Promise.all(
                    collectionData.map(async (_item) =>
                        formatItem(data, _item, specialFields),
                    ),
                );
                const filepath = path.join(storePath, collectionName + ".json");
                await writeFile(filepath, JSON.stringify(formatted));

                deployManifest.assets[
                    camelCaseCollectionName(
                        extractRawCollectionName(collectionName, namespace),
                    )
                ] = filepath;

                return { ...(await memo), [collectionName]: formatted };
            }
        }, {});

    async function formatItem(
        data: RefData,
        dbObj: RefItem,
        specialFields: Omit<
            ModelAnalysis,
            | "languagesCollection"
            | "websitePagesCollection"
            | "websiteSettingsCollection"
        >,
    ): Promise<RefItem | RefItem[]> {
        return Object.keys(dbObj).reduce(async (memo, fieldName) => {
            const dbVal = dbObj[fieldName];
            const recipe = getSpecialField(fieldName, specialFields);

            if (!recipe) {
                return { ...(await memo), [fieldName]: dbVal };
            }

            if (recipe[2].type === "m2o") {
                const { foreign } = recipe[2];
                if (
                    foreign.table !== collectionNames.pages &&
                    !isSystemCollection(foreign.table)
                ) {
                    const formatted = (data[foreign.table] as RefItem[]).find(
                        (_item) => _item[foreign.column] === dbVal,
                    );
                    return { ...(await memo), [fieldName]: formatted };
                }
            } else if (recipe[2].type === "m2m") {
                const _dbVal = dbVal as number[];
                const { intermediate, foreign } = recipe[2];
                const sortField = intermediate.sort || "id";
                if (
                    intermediate.table !== collectionNames.pages &&
                    !isSystemCollection(foreign.table)
                ) {
                    const intermediateItems = (
                        data[intermediate.table] as (RefItem & { id: number })[]
                    )
                        .filter((_item) => _dbVal.includes(_item["id"]))
                        .sort((a, b) =>
                            (a[sortField] as number) > (b[sortField] as number)
                                ? -1
                                : 1,
                        );
                    const foreignIds = intermediateItems.map(
                        (_item) => _item[intermediate.junction],
                    );
                    const formatted = (
                        data[foreign.table] as (RefItem & { id: number })[]
                    ).filter((_item) => foreignIds.includes(_item["id"]));
                    return { ...(await memo), [fieldName]: formatted };
                }
            } else if (recipe[2].type === "m2a") {
                const _dbVal = dbVal as number[];
                const { intermediate } = recipe[2];
                const sortField = intermediate.sort || "id";
                const formatted = (
                    data[intermediate.table] as (RefItem & {
                        id: number;
                        collection: string;
                        item: string;
                    })[]
                )
                    .filter((_item) => _dbVal.includes(_item["id"]))
                    .sort((a, b) =>
                        (a[sortField] as number) > (b[sortField] as number)
                            ? -1
                            : 1,
                    )
                    .map((_item) => {
                        const foreign = {
                            table: _item["collection"],
                            column: "id",
                        };
                        if (!data[foreign.table])
                            throw new Error(
                                `data doesnt have ${foreign.table}`,
                            );
                        if (foreign.table === collectionNames.pages) {
                            return _item;
                        }
                        const __item = (
                            data[foreign.table] as (RefItem & { id: number })[]
                        ).find(
                            (__item) => __item[foreign.column] === _item["id"],
                        );
                        if (!__item) return null;
                        return Object.assign({}, __item, {
                            _collection: foreign.table,
                        });
                    })
                    .filter((_item) => _item);
                return { ...(await memo), [fieldName]: formatted };
            } else if (recipe[2].type === "o2m") {
                const _dbVal = dbVal as number[];
                const { foreign } = recipe[2];
                const sortField = foreign.sort || "id";
                if (foreign.table !== collectionNames.pages) {
                    const formatted = (
                        data[foreign.table] as (RefItem & { id: number })[]
                    )
                        .filter((_item) => _dbVal.includes(_item["id"]))
                        .sort((a, b) =>
                            (a[sortField] as number) > (b[sortField] as number)
                                ? -1
                                : 1,
                        );
                    return { ...(await memo), [fieldName]: formatted };
                }
            }

            return { ...(await memo), [fieldName]: dbVal };
        }, {});
    }

    function isSystemCollection(collectionName: string) {
        return model.systemCollections.some(
            ({ collection }) => collection === collectionName,
        );
    }

    function scopeModelAnalysis(
        modelAnalysis: ModelAnalysis,
        collectionName: string,
    ): Omit<
        ModelAnalysis,
        | "languagesCollection"
        | "websitePagesCollection"
        | "websiteSettingsCollection"
    > {
        return {
            mediaFields: modelAnalysis.mediaFields.filter(
                (arr) => (arr[0] as string) === collectionName,
            ),
            htmlFields: modelAnalysis.htmlFields.filter(
                (arr) => (arr[0] as string) === collectionName,
            ),
            m2oFields: modelAnalysis.m2oFields.filter(
                (arr) => (arr[0] as string) === collectionName,
            ),
            m2mFields: modelAnalysis.m2mFields.filter(
                (arr) => (arr[0] as string) === collectionName,
            ),
            o2mFields: modelAnalysis.o2mFields.filter(
                (arr) => (arr[0] as string) === collectionName,
            ),
            m2aFields: modelAnalysis.m2aFields.filter(
                (arr) => (arr[0] as string) === collectionName,
            ),
        };
    }

    function isSingleton(v: RefItem | RefItem[]): v is RefItem {
        return !Array.isArray(v);
    }

    function getSpecialField(
        fieldName: string,
        specialFields: Omit<
            ModelAnalysis,
            | "languagesCollection"
            | "websitePagesCollection"
            | "websiteSettingsCollection"
        >,
    ):
        | ModelAnalysis[keyof Omit<
              ModelAnalysis,
              | "languagesCollection"
              | "websitePagesCollection"
              | "websiteSettingsCollection"
          >][number]
        | undefined {
        return (
            specialFields.mediaFields.find((arr) => arr[1] === fieldName) ||
            specialFields.htmlFields.find((arr) => arr[1] === fieldName) ||
            specialFields.m2oFields.find((arr) => arr[1] === fieldName) ||
            specialFields.m2mFields.find((arr) => arr[1] === fieldName) ||
            specialFields.o2mFields.find((arr) => arr[1] === fieldName) ||
            specialFields.m2aFields.find((arr) => arr[1] === fieldName)
        );
    }
}
