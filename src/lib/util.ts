export function camelCaseCollectionName(name: string) {
    return name.startsWith("directus")
        ? name
        : name
              .split("_")
              .map((word, i) =>
                  i === 0
                      ? word
                      : word.slice(0, 1).toUpperCase() + word.slice(1),
              )
              .join("");
}

export function extractRawCollectionName(name: string, namespace: string) {
    return name.startsWith(namespace)
        ? name.replace(namespace + "_", "")
        : name;
}

export function buildCollectionName(name: string, namespace: string) {
    return (namespace ? namespace + "_" : "") + name;
}
