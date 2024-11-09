export function genCollectionNames(
    namespace: string,
    additionalCollections: string[] = [],
) {
    const prefix = namespace ? namespace + "_" : "";
    const extra = additionalCollections.reduce(
        (memo, name) => Object.assign({}, memo, { [name]: name }),
        {},
    );

    return Object.assign({}, extra, {
        languages: prefix + "languages",
        settings: prefix + "settings",
        messageCatalog: prefix + "message_catalog",
        messageCatalogTranslations: prefix + "message_catalog_translations",
        pages: prefix + "pages",
        pagesTranslations: prefix + "pages_translations",
        pagesComponents: prefix + "pages_components",
    });
}
