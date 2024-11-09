import { type DirectusFile, type DirectusSettings } from "@directus/sdk";
import * as path from "node:path";
import { rm, unlink, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { fsUtil } from "@standard/backend";
import sharp from "sharp";
import getSlug from "speakingurl";

export class MediaManifest {
    private data: MediaManifestMap = new Map();

    filePath: string;
    mediaPath: string;
    downloadAssetAsArrayBuffer: DownloadAssetAsArrayBuffer;

    constructor(
        filePath: string,
        mediaPath: string,
        downloadAssetAsArrayBuffer: DownloadAssetAsArrayBuffer,
    ) {
        this.filePath = filePath;
        this.mediaPath = mediaPath;
        this.downloadAssetAsArrayBuffer = downloadAssetAsArrayBuffer;
    }

    async init() {
        if (await fsUtil.isFileExists(this.filePath)) {
            const json = await fsUtil.readJsonFile<MediaManifestJson>(
                this.filePath,
            );
            this.data = this.toJsMap(json);
        } else {
            await writeFile(this.filePath, JSON.stringify(new Map()));
        }
    }

    getMediaIds() {
        return Array.from(this.data.keys());
    }

    getData() {
        return this.data;
    }

    getPresetKeys(id: string) {
        return Array.from(this.data.get(id)!.keys());
    }

    updateTexts(files: DirectusFile[]) {
        files.map((file) => {
            const origItem = this.data.get(file.id)!.get("original");
            const payload: Record<string, unknown> = {};
            if (file.title) payload["title"] = file.title;
            if (file.description) payload["description"] = file.description;
            if (file.tags) payload["tags"] = file.tags;
            this.data
                .get(file.id)!
                .set("original", Object.assign({}, origItem, payload));
        });
    }

    async insertOne(
        file: DirectusFile,
        isImage: boolean,
        presets: DirectusSettings["storage_asset_presets"],
    ) {
        this.data.set(file.id, new Map());

        const fileExt = path.extname(file.filename_download);
        const fileName = path.basename(file.filename_download, fileExt);
        const fileNameFormatted = getSlug(fileName, { lang: "tr" });
        const fileHash = file.id.replace(/[-]+/g, "").slice(0, 12);
        const fileNameFull = `${fileNameFormatted}.${fileHash}${fileExt}`;
        const arrayBuffer = await this.downloadAssetAsArrayBuffer(file.id);
        const size = arrayBuffer.byteLength;
        const dest = `${this.mediaPath}/${fileNameFull}`;

        try {
            await pipeline(
                Readable.from(Buffer.from(arrayBuffer)),
                createWriteStream(dest),
            );
            // adding a delay to not push server too hard
            await this.delay(300);
        } catch (e) {
            throw new Error(
                `Failed to write file data to the file system. File: ${file.filename_download}`,
                { cause: e },
            );
        }

        const original: MediaManifestOriginalItem = {
            preset: "original",
            size,
            path: `/${fileNameFull}`,
        };

        if (file.title) original.title = file.title;
        if (file.description) original.description = file.description;
        if (file.tags) original.tags = file.tags;

        if (isImage) {
            try {
                const sharpImage = sharp(arrayBuffer);
                const imageMetadata = await sharpImage.metadata();
                const { width, height, orientation } = imageMetadata;

                if (!width || !height) {
                    throw new Error(
                        `Width or height is undefined. Failed to read image dimensions. File: ${file.filename_download}`,
                    );
                }

                const verifiedWidth = (orientation || 0) >= 5 ? height : width;
                const verifiedHeight = (orientation || 0) >= 5 ? width : height;

                original.width = verifiedWidth;
                original.height = verifiedHeight;
                original.aspectRatio = parseFloat(
                    (verifiedWidth / verifiedHeight).toFixed(2),
                );
            } catch (e) {
                throw new Error(
                    `Failed to read image dimensions. File: "${file.filename_download}" (${file.id})`,
                    { cause: e },
                );
            }
        }

        this.data.get(file.id)!.set("original", original);

        if (isImage && presets) {
            const presetKeys = presets.map((p) => p.key);
            const presetInsertionJobs = presetKeys.map(async (key: string) =>
                this.insertOneImagePreset(
                    file,
                    presets.find((p) => p.key === key)!,
                    true,
                ),
            );
            await Promise.all(presetInsertionJobs);
        }
    }

    async removeOne(id: string) {
        // remove physical files first
        for (const [_presetName, item] of this.data.get(id)!.entries()) {
            const relFilePath = path.isAbsolute(item.path)
                ? item.path.slice(1)
                : item.path;
            await unlink(path.join(this.mediaPath, relFilePath));
        }

        // and then update the manifest
        this.data.delete(id);
    }

    async insertOneImagePreset(
        file: DirectusFile,
        preset: NonNullable<DirectusSettings["storage_asset_presets"]>[0],
        isImage: boolean,
    ) {
        const fileExt = path.extname(file.filename_download);
        const fileName = path.basename(file.filename_download, fileExt);
        const fileNameFormatted = getSlug(fileName, { lang: "tr" });
        const fileHash = file.id.replace(/[-]+/g, "").slice(0, 12);
        const fileNameFull = `${fileNameFormatted}${isImage ? "." + preset.key : ""}.${fileHash}${fileExt}`;
        const arrayBuffer = await this.downloadAssetAsArrayBuffer(
            file.id,
            preset,
        );
        const size = arrayBuffer.byteLength;
        const dest = `${this.mediaPath}/${fileNameFull}`;

        try {
            await pipeline(
                Readable.from(Buffer.from(arrayBuffer)),
                createWriteStream(dest),
            );
            // adding a delay to not push server too hard
            await this.delay(300);
        } catch (e) {
            throw new Error(
                `Failed to write file data to the file system. File: ${file.filename_download}`,
                { cause: e },
            );
        }

        try {
            const sharpImage = sharp(arrayBuffer);
            const imageMetadata = await sharpImage.metadata();
            const { width, height, orientation } = imageMetadata;

            if (!width || !height) {
                throw new Error(
                    `Width or height is undefined. Failed to read image dimensions. File: ${file.filename_download}`,
                );
            }

            const verifiedWidth = (orientation || 0) >= 5 ? height : width;
            const verifiedHeight = (orientation || 0) >= 5 ? width : height;

            this.data.get(file.id)!.set(preset.key, {
                preset: preset.key,
                size,
                path: `/${fileNameFull}`,
                width: verifiedWidth,
                height: verifiedHeight,
                aspectRatio: parseFloat(
                    (verifiedWidth / verifiedHeight).toFixed(2),
                ),
            });
        } catch (e) {
            throw new Error(
                `Failed to read image dimensions. File: "${file.filename_download}" (${file.id})`,
                { cause: e },
            );
        }
    }

    async removeOnePreset(id: string, key: string) {
        const item = this.data.get(id)!.get(key)!;
        const relFilePath = path.isAbsolute(item.path)
            ? item.path.slice(1)
            : item.path;
        await unlink(path.join(this.mediaPath, relFilePath));
        this.data.get(id)!.delete(key);
    }

    async flush() {
        await unlink(this.filePath);

        this.data = new Map();

        await rm(this.mediaPath, { recursive: true, force: true });

        await writeFile(this.filePath, JSON.stringify(new Map()));
    }

    async updateManifestFile() {
        await writeFile(
            this.filePath,
            JSON.stringify(this.toJson(this.getData())),
        );
    }

    toJsMap(json: MediaManifestJson) {
        const m: MediaManifestMap = new Map();

        for (const key of Object.keys(json)) {
            m.set(key, new Map());

            for (const key2 of Object.keys(json[key]!)) {
                m.get(key)!.set(key2, json[key]![key2]!);
            }
        }

        return m;
    }

    toJson(m: MediaManifestMap) {
        const json: MediaManifestJson = {};

        for (const [key, value] of m.entries()) {
            json[key] = {};

            for (const [key2, value2] of value.entries()) {
                json[key][key2] = value2;
            }
        }

        return json;
    }

    async delay(ms: number) {
        return new Promise((resolve) => setTimeout(() => resolve(true), ms));
    }
}
