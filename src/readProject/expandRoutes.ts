import { fsUtil } from "@gozel-core/standard-js-backend";
import {
    buildCollectionName,
    camelCaseCollectionName,
    extractRawCollectionName,
} from "../lib/util";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { deployManifest } from "../sync/deployManifest";

export async function expandRoutes(
    storePath: string,
    data: Record<string, unknown>,
    execDir: string,
    project: string,
) {
    const keysToExclude = [
        "id",
        "user_created",
        "user_updated",
        "date_created",
        "date_updated",
    ];
    const languages = data["languages"] as LanguagesCollection[];
    const mediaManifest = data["mediaManifest"] as MediaManifestJson;
    const pageTranslations = data[
        "pagesTranslations"
    ] as PageTranslationCollection[];
    const pageComponentRelations = data[
        "pagesComponents"
    ] as PageComponentRelation[];
    const routes = data["routes"] as RouteItem[];
    const dir = (await fsUtil.isFileExists(path.join(execDir, "src")))
        ? path.join(execDir, "src", "directus-data")
        : path.join(execDir, "directus-data");

    await fsUtil.verifyDir(dir, true);

    for (const language of languages) {
        const expandingRoutes = await Promise.all(
            routes.map(async (route) => await expandRouteItem(route, language)),
        );
        const _routes = expandingRoutes.filter((route) => route);
        await writeFile(
            path.join(dir, `route.${language.code}.json`),
            JSON.stringify(_routes),
        );
        console.log(
            `- Generated and saved "${path.join(dir, `route.${language.code}.json`)}"`,
        );
    }

    async function expandRouteItem(
        item: RouteItem,
        language: LanguagesCollection,
    ) {
        if (!item.paths[language.code]) return undefined;

        const routeDefaultKeys = [
            "id",
            "status",
            "sort",
            "user_created",
            "user_updated",
            "date_created",
            "date_updated",
            "cover",
            "search_engine_robots_directives",
            "canonical_url",
            "routing_identifiers",
            "frontend_component",
            "navigation_parent",
            "translations",
            "components",
            "paths",
            "breadcrumb",
        ];
        const translations = item.translations.map(
            (tId) => pageTranslations.find(({ id }) => id === tId)!,
        );
        const translation = translations.find(
            (t) =>
                t[deployManifest["translationJunctionField"]!] ===
                language[deployManifest["languageCodeField"]!],
        );

        if (!translation) return undefined;

        const result: Record<string, unknown> = {
            id: item.id,
            published: Object.hasOwn(translation, "status")
                ? translation.status === "published"
                : item.status === "published",
            sort: item.sort ?? 0,
            serd: item.search_engine_robots_directives,
            component: item.frontend_component,
            parent: item.navigation_parent,
            path: item.paths[language.code],
            breadcrumb: item.breadcrumb,
            title: translation.title,
            excerpt: translation.excerpt,
            slug: translation.slug,
            components: await Promise.all(
                item.components.map(
                    async (cId) => await expandComponent(cId, language),
                ),
            ),
        };

        if (item.canonical_url) result["canonicalUrl"] = item.canonical_url;
        if (item.cover) result["cover"] = expandMediaItem(item.cover);
        if (item.routing_identifiers)
            result["routingIdentifiers"] = item.routing_identifiers;

        Object.keys(item)
            .filter((k) => !routeDefaultKeys.includes(k))
            .map(
                (k) =>
                    (result[k] = resolveField(
                        buildCollectionName(
                            "pages",
                            deployManifest["namespace"] ?? "",
                        ),
                        k,
                        item,
                        language,
                    )),
            );

        return result;
    }

    async function expandComponent(cId: number, language: LanguagesCollection) {
        const relation = pageComponentRelations.find(({ id }) => id === cId)!;
        const name = camelCaseCollectionName(
            extractRawCollectionName(
                relation.collection,
                deployManifest["namespace"] ?? "",
            ),
        );

        if (!data[name])
            throw new Error(`No property such as "${name}" in read data.`);

        const items = data[name] as PageComponent[];
        const item = items.find(
            ({ id }) => id === parseFloat(relation.item),
        ) as PageComponent;
        const tName = Object.hasOwn(item, "translations")
            ? name + "Translations"
            : undefined;

        if (tName && !data[tName])
            throw new Error(`No property such as "${tName}" in read data.`);

        return Object.keys(item)
            .filter((k) => !keysToExclude.includes(k))
            .reduce(
                (memo: Record<string, unknown>, k) => {
                    if (k === "translations") {
                        const _tItem = (
                            item[
                                k as keyof typeof item
                            ] as unknown as PageComponentTranslation[]
                        ).find(
                            (__tItem) =>
                                __tItem[
                                    deployManifest["translationJunctionField"]!
                                ] ===
                                language[deployManifest["languageCodeField"]!],
                        );
                        if (!_tItem) return memo;

                        Object.keys(_tItem)
                            .filter((_k) => !keysToExclude.includes(_k))
                            .map(
                                (_k) =>
                                    (memo[_k] = resolveField(
                                        relation.collection + "_translations",
                                        _k,
                                        _tItem,
                                        language,
                                    )),
                            );
                    } else {
                        memo[k] = resolveField(
                            relation.collection,
                            k,
                            item,
                            language,
                        );
                    }

                    return memo;
                },
                {
                    _component: name.replace("component", ""),
                },
            );
    }

    function expandMediaItem(uuid: string | undefined) {
        if (!uuid) return undefined;
        if (!mediaManifest[uuid])
            throw new Error(`Failed to find media:${uuid}`);

        const media = mediaManifest[uuid];
        const original = media["original"]! as MediaManifestOriginalItem;
        const result: {
            title?: string;
            description?: string;
            presets: Record<
                string,
                { s: number; path: string; w: number; h: number; ar: number }
            >;
        } = {
            presets: { original: { s: 0, path: "", w: 0, h: 0, ar: 0 } },
        };

        if (original.title) result["title"] = original.title;
        if (original.description) result["description"] = original.description;

        result.presets = Object.keys(media).reduce(
            (
                memo: Record<
                    string,
                    {
                        s: number;
                        path: string;
                        w: number;
                        h: number;
                        ar: number;
                    }
                >,
                preset,
            ) => {
                if (preset === "original") return memo;
                memo[preset] = {
                    s: media[preset]!.size,
                    path: media[preset]!.path,
                    w: media[preset]!.width!,
                    h: media[preset]!.height!,
                    ar: media[preset]!.aspectRatio!,
                };
                return memo;
            },
            {},
        );

        return result;
    }

    function resolveField(
        collection: string,
        name: string,
        item: Record<string, unknown>,
        language: LanguagesCollection,
    ) {
        const predicate = (arr) => arr[0] === collection && arr[1] === name;

        if (deployManifest.relationalFields.mediaFields.some(predicate)) {
            return expandMediaItem(item[name as keyof typeof item] as string);
        } else if (deployManifest.relationalFields.htmlFields.some(predicate)) {
            return item[name as keyof typeof item];
        } else if (deployManifest.relationalFields.m2oFields.some(predicate)) {
            const arr =
                deployManifest.relationalFields.m2oFields.find(predicate)!;
            const value = item[name as keyof typeof item] as unknown[];
            const { type, specials, foreign } = arr[2];

            if (
                foreign.table ===
                buildCollectionName("pages", deployManifest["namespace"] ?? "")
            ) {
                return item[name as keyof typeof item];
            }

            const _item = data[
                camelCaseCollectionName(
                    extractRawCollectionName(
                        foreign.table,
                        deployManifest["namespace"] ?? "",
                    ),
                )
            ]!.find((_item) => _item[foreign.column] === value);

            return Object.keys(_item)
                .filter((k) => !keysToExclude.includes(k))
                .reduce((memo, k) => {
                    memo[k] = _item[k];
                    return memo;
                }, {});
        } else if (deployManifest.relationalFields.o2mFields.some(predicate)) {
            const arr =
                deployManifest.relationalFields.o2mFields.find(predicate)!;
            const value = item[name as keyof typeof item] as unknown[];
            const { type, specials, foreign } = arr[2];

            if (
                foreign.table ===
                buildCollectionName("pages", deployManifest["namespace"] ?? "")
            ) {
                return item[name as keyof typeof item];
            }

            return value.map((_value) =>
                Object.keys(_value)
                    .filter((k) => !keysToExclude.includes(k))
                    .reduce((memo: Record<string, unknown>, k) => {
                        if (k === "translations") {
                            const _tItem = data[
                                camelCaseCollectionName(
                                    extractRawCollectionName(
                                        foreign.table + "_translations",
                                        deployManifest["namespace"] ?? "",
                                    ),
                                )
                            ]!.find(
                                (__tItem) =>
                                    __tItem[
                                        deployManifest[
                                            "translationJunctionField"
                                        ]!
                                    ] ===
                                    language[
                                        deployManifest["languageCodeField"]!
                                    ],
                            );
                            if (!_tItem) return memo;

                            Object.keys(_tItem)
                                .filter((_k) => !keysToExclude.includes(_k))
                                .map(
                                    (_k) =>
                                        (memo[_k] = resolveField(
                                            foreign.table + "_translations",
                                            _k,
                                            _tItem,
                                            language,
                                        )),
                                );
                        } else {
                            memo[k] = _value[k];
                        }

                        return memo;
                    }, {}),
            );
        } else if (deployManifest.relationalFields.m2mFields.some(predicate)) {
            if (
                collection ===
                buildCollectionName("pages", deployManifest["namespace"] ?? "")
            ) {
                return item[name as keyof typeof item];
            }
            const arr =
                deployManifest.relationalFields.m2mFields.find(predicate)!;
            const value = item[name as keyof typeof item] as number[];
            const { type, specials, intermediate, foreign } = arr[2];
            const intermediateItems = data[
                camelCaseCollectionName(
                    extractRawCollectionName(
                        intermediate.table,
                        deployManifest["namespace"]!,
                    ),
                )
            ]!.filter((_item) => value.includes(_item[intermediate.column]));
            const intermediateIds = intermediateItems
                .filter((_item) => _item[intermediate.junction])
                .map((_item) =>
                    specials.includes("files")
                        ? _item["directus_files_id"]
                        : _item[intermediate.junction],
                );
            return specials.includes("files")
                ? intermediateIds.map((id) => expandMediaItem(id))
                : data[
                      camelCaseCollectionName(
                          extractRawCollectionName(
                              foreign.table,
                              deployManifest["namespace"]!,
                          ),
                      )
                  ]!.filter((_item) =>
                      intermediateIds.includes(_item[foreign.column]),
                  );
        } else {
            return item[name as keyof typeof item];
        }
    }
}

type RouteItem = PagesCollection & {
    paths: Record<string, string>;
    breadcrumb: number[];
    frontend_component: string;
};

type PageComponentRelation = {
    id: number;
    item: string;
    collection: string;
    sort: number;
};

type PageComponent = {
    id: number;
};

type PageComponentTranslation = {
    id: number;
} & Record<string, string>;
