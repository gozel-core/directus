import { URL } from "node:url";
import * as path from "node:path";

export function analyseData(data: RefData, modelAnalysis: ModelAnalysis) {
    console.log(`Analysing data.`);

    // let's find all media ids in the project

    // find regular fields that contain media id
    const mediaIds: string[] = [];
    const collectionsHaveMedia = modelAnalysis.mediaFields.map(
        (arr) => arr[0] as string,
    );
    Object.keys(data)
        .filter((collectionName) =>
            collectionsHaveMedia.includes(collectionName),
        )
        .map((collectionName) => {
            const mediaFields = modelAnalysis.mediaFields
                .filter((arr) => (arr[0] as string) === collectionName)
                .map((arr) => arr[1] as string);
            const _value = data[collectionName]!;

            if (Array.isArray(_value)) {
                _value.map((item) =>
                    Object.keys(item)
                        .filter((itemField) => mediaFields.includes(itemField))
                        .map((itemField) =>
                            mediaIds.push(
                                item[itemField as keyof typeof item] as string,
                            ),
                        ),
                );
            } else {
                Object.keys(_value)
                    .filter((itemField) => mediaFields.includes(itemField))
                    .map((itemField) =>
                        mediaIds.push(
                            _value[itemField as keyof typeof _value] as string,
                        ),
                    );
            }
        });

    // find media ids by parsing html fields
    const collectionsHaveMediaInTheirHtmlFields = modelAnalysis.htmlFields.map(
        (arr) => arr[0] as string,
    );
    Object.keys(data)
        .filter((collectionName) =>
            collectionsHaveMediaInTheirHtmlFields.includes(collectionName),
        )
        .map((collectionName) => {
            const htmlFields = modelAnalysis.htmlFields
                .filter((arr) => (arr[0] as string) === collectionName)
                .map((arr) => arr[1] as string);
            const _value = data[collectionName]!;

            if (Array.isArray(_value)) {
                _value.map((item) =>
                    Object.keys(item)
                        .filter((itemField) => htmlFields.includes(itemField))
                        .map((itemField) => {
                            const htmlText = item[
                                itemField as keyof typeof item
                            ] as string;
                            const foundMediaIds =
                                findMediaIdFromHtmlText(htmlText);
                            mediaIds.push(...foundMediaIds);
                        }),
                );
            } else {
                Object.keys(_value)
                    .filter((itemField) => htmlFields.includes(itemField))
                    .map((itemField) => {
                        const htmlText = _value[
                            itemField as keyof typeof _value
                        ] as string;
                        const foundMediaIds = findMediaIdFromHtmlText(htmlText);
                        mediaIds.push(...foundMediaIds);
                    });
            }
        });

    const mediaIdsUniq = mediaIds.filter(
        (id, i, self) => id && self.indexOf(id) === i,
    );
    console.log(`Media file identifiers found (${mediaIdsUniq.length})`);

    const websiteSettings = modelAnalysis.websiteSettingsCollection
        ? (data[
              modelAnalysis.websiteSettingsCollection.collection
          ] as SettingsCollection)
        : undefined;

    return {
        mediaIds: mediaIdsUniq,
        websiteSettings,
    };
}

export function findMediaIdFromHtmlText(htmlText: string) {
    if (!htmlText) return [];

    const imgSrcMatches = htmlText.match(/src\s*=\s*"(.+?)"/g);

    if (imgSrcMatches) {
        return imgSrcMatches.map((line) => {
            const url = line.slice(5, -1);
            const urlobj = new URL(url);
            const mediaFilename = urlobj.pathname.slice(
                urlobj.pathname.lastIndexOf("/") + 1,
            );
            const mediaId = path.basename(
                mediaFilename,
                path.extname(mediaFilename),
            );
            return mediaId;
        });
    }

    return [];
}
