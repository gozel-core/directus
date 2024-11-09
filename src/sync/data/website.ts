import { writeFile } from "node:fs/promises";
import * as path from "node:path";
import { EOL } from "node:os";
import { parseRobotsTxt } from "robotstxt-util";
import type { genCollectionNames } from "../../lib/genCollectionNames";
import { deployManifest } from "../deployManifest";

export async function createWebsiteData(
    storePath: string,
    deploySettings: DeploySettings,
    collectionNames: ReturnType<typeof genCollectionNames>,
    model: RefDataModel,
    modelAnalysis: ModelAnalysis,
    data: RefData,
    dataAnalysis: DataAnalysis,
) {
    console.log("Checking website data.");

    const pagesCollection = modelAnalysis.websitePagesCollection;

    if (!pagesCollection) {
        console.log("No pages collection found.");
        return;
    }

    const languagesCollection = modelAnalysis.languagesCollection;
    const languageCodeField = modelAnalysis.languagesPrimaryKey?.field;

    if (!languageCodeField)
        throw new Error(`Failed to detect primary key field in languages.`);

    deployManifest["languageCodeField"] = languageCodeField;

    const defaultLanguage = languagesCollection
        ? (data[languagesCollection.collection] as LanguagesCollection[]).find(
              ({ is_default }) => is_default === true,
          )?.code
        : process.env.DEFAULT_LOCALE;

    if (!defaultLanguage) {
        throw new Error(
            languagesCollection
                ? `None of the languages in the "${languagesCollection.collection}" marked as default. Specify one as default please.`
                : `Missing env var "DEFAULT_LOCALE".`,
        );
    }

    const languages = languagesCollection
        ? (data[languagesCollection.collection] as LanguagesCollection[])
        : undefined;
    const translationJunctionFieldName = modelAnalysis.o2mFields.find(
        (arr) =>
            arr[0] === pagesCollection.collection &&
            arr[2].specials.includes("translations"),
    )![2].foreign.junction;

    deployManifest["translationJunctionField"] = translationJunctionFieldName;

    console.log(
        `Creating website data with ${
            languages
                ? languages
                      .map(
                          ({ code }) =>
                              code +
                              (code === defaultLanguage ? " (default)" : ""),
                      )
                      .join(", ") + " locale options."
                : "default locale:" + defaultLanguage
        }`,
    );

    const navigationIdFieldName = model.relations.find(
        (relation) =>
            relation.meta &&
            relation.meta.many_field ===
                modelAnalysis.websiteNavigationField?.field &&
            relation.meta.many_collection === pagesCollection.collection,
    )!.meta.many_field as string;
    const pages = data[pagesCollection.collection] as PagesCollection[];
    const _pages = pages.map((_page) =>
        Object.assign({}, _page, {
            translationsObject: getPageTranslations(_page),
        }),
    );
    const routes = _pages.map((page, index) => {
        // breadcrumb
        const breadcrumb = [page];
        let _parent = page[navigationIdFieldName];
        while (typeof _parent === "number") {
            const p = _pages.find((p) => p.id === _parent);
            if (!p) break;
            breadcrumb.unshift(p);
            _parent = p[navigationIdFieldName];
        }
        const breadcrumbIds = breadcrumb.map((_page) => _page.id);

        // full url paths by locale
        const paths = languages
            ? languages.reduce((memo: Record<string, string>, language) => {
                  // ignore if there is one page without a translation in the breadcrumb
                  if (
                      breadcrumb.some(
                          ({ translationsObject }) =>
                              !translationsObject[language.code],
                      )
                  ) {
                      return memo;
                  }

                  memo[language.code] =
                      "/" +
                      breadcrumb
                          .map((_page, i) =>
                              i === 0 && language.code === defaultLanguage
                                  ? ""
                                  : i === 0
                                    ? slugifyLocale(language.code)
                                    : _page.translationsObject[language.code]!
                                          .slug,
                          )
                          .filter((str) => str.length > 0)
                          .join("/");

                  return memo;
              }, {})
            : {
                  [defaultLanguage]:
                      "/" +
                      breadcrumb
                          .map((_page, i) =>
                              i === 0 ? "" : (_page["slug"] as string),
                          )
                          .filter((str) => str.length > 0)
                          .join("/"),
              };
        //const path = paths[defaultLanguage] || ''

        const frontendComponent =
            (page.frontend_component || "Auto") === "Auto"
                ? pages.find(
                      (_page) => _page.id === page[navigationIdFieldName],
                  )!.frontend_component + "Item"
                : page.frontend_component;

        console.log(
            `${paths[defaultLanguage] || paths[Object.keys(paths)[0]!]}`,
        );

        return Object.assign({}, pages[index], {
            paths,
            breadcrumb: breadcrumbIds,
            frontend_component: frontendComponent,
        });
    });

    console.log(`Routes generated (${routes.length})`);

    await writeFile(
        path.join(storePath, "routes.json"),
        JSON.stringify(routes),
    );
    deployManifest.assets["routes"] = path.join(storePath, "routes.json");

    console.log(`Routes saved.`);

    const sitemaps = await createSitemap();
    await createRobotsTxt(sitemaps);

    function getPageTranslations(page: PagesCollection) {
        return page.translations
            .map(
                (tId) =>
                    (
                        data[
                            collectionNames.pagesTranslations
                        ] as PageTranslationCollection[]
                    ).find(({ id }) => id === tId)!,
            )
            .reduce((memo: Record<string, PageTranslationCollection>, pt) => {
                const locale = languages!.find(
                    (l) =>
                        l[languageCodeField!] ===
                        pt[translationJunctionFieldName],
                )!.code;
                memo[locale] = pt;
                return memo;
            }, {});
    }

    async function createSitemap() {
        console.log("Generating sitemap.");

        const sitemaps: Record<string, string> = {};

        if (languages) {
            const sitemapJobs = languages.map(async (language) => {
                const xml = [
                    '<?xml version="1.0" encoding="UTF-8"?>',
                    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                ];

                // TODO create an algorithm to add lastmod here.
                // it might even support automation of content updates.
                routes.map((route) => {
                    if (route.paths[language.code]) {
                        xml.push(
                            `    <url><loc>${process.env.APP_URL + route.paths[language.code]}</loc></url>`,
                        );
                    }
                });

                xml.push("</urlset>");

                await writeFile(
                    path.join(storePath, `sitemap.${language.code}.xml`),
                    xml.join(EOL),
                );

                deployManifest.assets[`sitemap.${language.code}`] = path.join(
                    storePath,
                    `sitemap.${language.code}.xml`,
                );

                sitemaps[language.code] = `sitemap.${language.code}.xml`;

                console.log(`sitemap.${language.code}.xml`);
            });
            await Promise.all(sitemapJobs);
        } else {
            const xml = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ];

            routes.map((route) => {
                xml.push(
                    `    <url><loc>${process.env.APP_URL + route.paths[defaultLanguage!]}</loc></url>`,
                );
            });

            xml.push("</urlset>");

            await writeFile(path.join(storePath, `sitemap.xml`), xml.join(EOL));

            deployManifest.assets["sitemap"] = path.join(
                storePath,
                `sitemap.xml`,
            );

            sitemaps[defaultLanguage!] = `sitemap.xml`;

            console.log(`sitemap.xml`);
        }

        return sitemaps;
    }

    async function createRobotsTxt(sitemaps: Record<string, string> = {}) {
        console.log(`Generating robots.txt`);

        const robotstxt = parseRobotsTxt(deploySettings.robots_txt || "");

        if (dataAnalysis.websiteSettings) {
            const { search_engine_indexing } = dataAnalysis.websiteSettings;
            if (search_engine_indexing) robotstxt.newGroup("*").allow("/");
            else robotstxt.newGroup("*").disallow("/");
        } else {
            robotstxt.newGroup("*").disallow("/");
        }

        Object.keys(sitemaps).map((language) =>
            robotstxt.add("sitemap", sitemaps[language]!),
        );

        await writeFile(path.join(storePath, `robots.txt`), robotstxt.txt());

        deployManifest.assets["robots"] = path.join(storePath, `robots.txt`);

        return robotstxt;
    }

    function slugifyLocale(text: string) {
        return text.toLowerCase().replace("_", "-");
    }
}
