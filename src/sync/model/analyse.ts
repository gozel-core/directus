import type { genCollectionNames } from "../../lib/genCollectionNames";
import { deployManifest } from "../deployManifest";

export function analyseModel(
    model: RefDataModel,
    collectionNames: ReturnType<typeof genCollectionNames>,
) {
    console.log(`Analysing model.`);

    const mediaFields = model.fields
        .filter(
            (field) =>
                field.meta &&
                field.meta.special &&
                (field.meta.special.includes("file") ||
                    field.meta.special.includes("files")),
        )
        .reduce((memo: ModelAnalysis["mediaFields"], field) => {
            if (
                field.meta &&
                field.meta.special &&
                field.meta.special.includes("files")
            ) {
                const relevantRelations = model.relations.filter(
                    (relation) => relation.meta.one_field === field.field,
                );
                memo = memo.concat(
                    relevantRelations.map((_relation) => [
                        _relation.meta.many_collection as string,
                        "directus_files_id",
                        { type: "file", specials: field.meta.special || [] },
                    ]),
                );
            } else {
                memo = memo.concat([
                    [
                        field.collection,
                        field.field,
                        { type: "file", specials: field.meta.special || [] },
                    ],
                ]);
            }
            return memo;
        }, []);
    deployManifest.relationalFields.mediaFields = mediaFields;
    //console.log(`Media fields:`);
    //console.log(mediaFields);

    const htmlFields = model.fields
        .filter(
            (field) =>
                field.meta && field.meta.interface === "input-rich-text-html",
        )
        .map(({ field, collection, meta }) => [
            collection,
            field,
            { type: "html", specials: meta.special || [] },
        ]) as ModelAnalysis["htmlFields"];
    deployManifest.relationalFields.htmlFields = htmlFields;
    //console.log(`HTML fields:`);
    //console.log(htmlFields);

    const m2oSpecials = ["m2o", "file", "user-created", "user-updated"];
    const m2oFields = model.fields
        .filter(
            (field) =>
                field.schema &&
                field.schema.foreign_key_table &&
                !field.schema.foreign_key_table.startsWith("directus") &&
                field.schema.foreign_key_column &&
                field.meta &&
                field.meta.special &&
                field.meta.special.some((v) => m2oSpecials.includes(v)),
        )
        .map(
            ({
                field,
                collection,
                meta,
                schema: { foreign_key_table, foreign_key_column },
            }) => [
                collection,
                field,
                {
                    type: "m2o",
                    specials: meta.special,
                    foreign: {
                        table: foreign_key_table,
                        column: foreign_key_column,
                    },
                },
            ],
        ) as ModelAnalysis["m2oFields"];
    deployManifest.relationalFields.m2oFields = m2oFields;
    //console.log(`M2O fields:`);
    //console.log(m2oFields);

    const m2mSpecials = ["m2m", "files"];
    const m2mFields = model.fields
        .filter(
            (field) =>
                !field.schema &&
                field.meta &&
                field.meta.special &&
                field.meta.special.some((v) => m2mSpecials.includes(v)),
        )
        .map(({ field, collection, meta }) => {
            const relation = model.relations.find(
                (relation) =>
                    relation.meta &&
                    relation.meta.one_field === field &&
                    relation.meta.one_collection === collection,
            )!;

            if (!relation)
                throw new Error(
                    `Couldn't find relation for ${collection}:${field}`,
                );

            const intermediate = {
                table: relation.meta.many_collection,
                column: relation.meta.many_field,
                junction: relation.meta.junction_field,
                sort: relation.meta.sort_field,
            };
            const foreignField = model.fields.find(
                (_field) =>
                    _field.field === relation.meta.junction_field &&
                    _field.collection === relation.meta.many_collection,
            );
            const foreign = {
                table: foreignField?.schema.foreign_key_table,
                column: foreignField?.schema.foreign_key_column,
            };
            return [
                collection,
                field,
                { type: "m2m", specials: meta.special, intermediate, foreign },
            ];
        }) as ModelAnalysis["m2mFields"];
    deployManifest.relationalFields.m2mFields = m2mFields;
    //console.log(`M2M fields:`);
    //console.dir(m2mFields, { depth: 3 });

    const o2mSpecials = ["o2m", "translations"];
    const o2mFields = model.fields
        .filter(
            (field) =>
                !field.schema &&
                field.meta &&
                field.meta.special &&
                field.meta.special.some((v) => o2mSpecials.includes(v)),
        )
        .map(({ field, collection, meta }) => {
            const relation = model.relations.find(
                (relation) =>
                    relation.meta &&
                    relation.meta.one_field === field &&
                    relation.meta.one_collection === collection,
            );

            if (!relation)
                throw new Error(
                    `Couldn't find relation for ${collection}:${field}`,
                );

            if (relation.meta.many_collection?.startsWith("directus"))
                return undefined;

            const foreign = {
                table: relation.meta.many_collection,
                column: relation.meta.many_field,
                junction: relation.meta.junction_field,
                sort: relation.meta.sort_field,
            };
            return [
                collection,
                field,
                { type: "o2m", specials: meta.special, foreign },
            ];
        })
        .filter((v) => v) as ModelAnalysis["o2mFields"];
    deployManifest.relationalFields.o2mFields = o2mFields;
    //console.log(`O2M fields:`);
    //console.dir(o2mFields, { depth: 3 });

    const m2aSpecials = ["m2a"];
    const m2aFields = model.fields
        .filter(
            (field) =>
                !field.schema &&
                field.meta &&
                field.meta.special &&
                field.meta.special.some((v) => m2aSpecials.includes(v)),
        )
        .map(({ field, collection, meta }) => {
            const relation = model.relations.find(
                (relation) =>
                    relation.meta &&
                    relation.meta.one_field === field &&
                    relation.meta.one_collection === collection,
            )!;
            const intermediate = {
                table: relation.meta.many_collection,
                column: relation.meta.many_field,
                junction: relation.meta.junction_field,
                sort: relation.meta.sort_field,
            };
            return [
                collection,
                field,
                { type: "m2a", specials: meta.special, intermediate },
            ];
        }) as ModelAnalysis["m2aFields"];
    deployManifest.relationalFields.m2aFields = m2aFields;
    //console.log(`M2A fields:`);
    //console.dir(m2aFields, { depth: 3 });

    const languagesCollection = model.collections.find(
        ({ collection }) => collection === collectionNames.languages,
    );
    const languagesPrimaryKey = model.fields.find(
        ({ collection, schema }) =>
            collection === collectionNames.languages &&
            schema &&
            schema.is_primary_key === true,
    );

    const refCollections = Object.values(collectionNames);
    const websiteNavigationField = model.fields.find(
        ({ field, collection, meta }) =>
            field.includes("navigation") &&
            meta.special &&
            meta.special.includes("m2o") &&
            refCollections.includes(collection),
    );
    const websitePagesCollection = websiteNavigationField
        ? model.collections.find(
              ({ collection }) =>
                  collection === websiteNavigationField.collection,
          )
        : undefined;

    const websiteSettingsCollection = model.collections.find(
        ({ collection, meta }) => collection.endsWith("settings"),
    );

    return {
        mediaFields,
        htmlFields,
        m2oFields,
        m2mFields,
        o2mFields,
        m2aFields,
        languagesCollection,
        languagesPrimaryKey,
        websitePagesCollection,
        websiteNavigationField,
        websiteSettingsCollection,
    };
}
