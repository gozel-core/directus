import type { MediaManifest } from "./manifest";
import type { DirectusFile, DirectusSettings } from "@directus/sdk";

export async function sync(
    manifest: MediaManifest,
    upToDateMediaIds: string[],
    upToDatePresets: DirectusSettings["storage_asset_presets"],
    files: DirectusFile[],
) {
    const mediaIdsToRemove = manifest
        .getMediaIds()
        .filter((id: string) => !upToDateMediaIds.includes(id));
    if (mediaIdsToRemove.length > 0) {
        console.log(
            `Removing media items (${mediaIdsToRemove.length}) that are not available anymore.`,
        );
        const cleanupJobs = mediaIdsToRemove.map(async (id: string) =>
            manifest.removeOne(id),
        );
        await Promise.all(cleanupJobs);
    }

    if (upToDateMediaIds.length === 0) {
        console.log(
            `No media file has been found. Cleaning the manifest and folder.`,
        );
        await manifest.flush();
        return;
    }

    const newPresetKeys = upToDatePresets
        ? upToDatePresets.map(({ key }) => key)
        : [];
    for (const [id, _items] of manifest.getData().entries()) {
        const fileObj = findFileById(id);

        if (isImage(fileObj)) {
            const existingPresetKeys = manifest.getPresetKeys(id);

            const toRemove = existingPresetKeys.filter(
                (_name) =>
                    _name !== "original" && !newPresetKeys.includes(_name),
            );
            if (toRemove.length > 0) {
                const presetRemoveJobs = toRemove.map(async (key: string) =>
                    manifest.removeOnePreset(id, key),
                );
                await Promise.all(presetRemoveJobs);

                // remove file too if it became empty
                if (manifest.getData().get(id)!.size === 0) {
                    await manifest.removeOne(id);
                }
            }

            const toAdd = newPresetKeys.filter(
                (_name) =>
                    !existingPresetKeys.includes(_name) && _name !== "original",
            );
            if (toAdd.length > 0) {
                const presetInsertionJobs = toAdd.map(async (key: string) =>
                    manifest.insertOneImagePreset(
                        fileObj,
                        upToDatePresets!.find((p) => p.key === key)!,
                        true,
                    ),
                );
                await Promise.all(presetInsertionJobs);
            }
        }
    }

    const mediaIdsToAdd = upToDateMediaIds.filter(
        (id) => !manifest.getMediaIds().includes(id),
    );
    if (mediaIdsToAdd.length > 0) {
        console.log(`Adding new media items (${mediaIdsToAdd.length})`);
        const newJobs = mediaIdsToAdd.map(async (id: string) => {
            const fileObj = findFileById(id);
            return manifest.insertOne(
                fileObj,
                isImage(fileObj),
                upToDatePresets,
            );
        });
        await Promise.all(newJobs);
    }

    manifest.updateTexts(files);

    await manifest.updateManifestFile();

    function findFileById(fileId: string) {
        return files.find(({ id }) => id === fileId)!;
    }

    function isImage(file: DirectusFile) {
        return file.type && file.type.startsWith("image") ? true : false;
    }
}
