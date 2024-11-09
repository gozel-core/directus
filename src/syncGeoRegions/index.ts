import {
    territories,
    countries,
    timezones,
    findCountryTerritory,
} from "locale-util";
import { readItems, createItems } from "@directus/sdk";
import { getDirectusClient } from "../lib/getDirectusClient";
import { GEO_REGIONS_COLLECTION, TIMEZONES_COLLECTION } from "../constants";

export async function syncGeoRegions() {
    console.log(`Directus geo regions sync...`);

    const client = await getDirectusClient();

    console.log(`Fetching geo regions first...`);
    const items = await client.request<GeoRegions[]>(
        readItems(GEO_REGIONS_COLLECTION),
    );
    console.log(`Fetching geo regions first... Done.`);

    const world: GeoRegions = {
        code: "001",
        english_name: "World",
        type: "world",
        parent: null,
        status: "published",
    };
    const savedWorld = !exists(world)
        ? (await save([world]))[0]!
        : findOne(world)!;

    console.log(`Verifying territories...`);
    const toSaveTerritories = [];
    for (const territory of territories) {
        const _territory = {
            code: territory.code,
            english_name: territory.name,
            type: "territory",
            parent: savedWorld["id"]!,
            status: "published" as const,
        };
        if (!exists(_territory)) toSaveTerritories.push(_territory);
    }
    const savedTerritories =
        toSaveTerritories.length > 0
            ? await save(toSaveTerritories)
            : findMany({ type: "territory" });
    console.log(
        `Verifying territories... Done. (${savedTerritories.length} countries found.)`,
    );

    console.log(`Verifying countries...`);
    const toSaveCountries = [];
    for (const country of countries) {
        const _territory = findCountryTerritory(country.code);
        if (!_territory) {
            console.log(
                `the country ${country.code} has no territory, therefore skipping`,
            );
            continue;
        }
        const parent = savedTerritories.find(
            (__territory) => __territory.code === _territory.code,
        )!.id!;
        const _country = {
            code: country.code,
            english_name: country.englishName,
            native_name: country.nativeName!,
            type: "country",
            parent,
            status: "published" as const,
        };
        if (!exists(_country)) toSaveCountries.push(_country);
    }
    const savedCountries =
        toSaveCountries.length > 0
            ? await save(toSaveCountries)
            : findMany({ type: "country" });
    console.log(
        `Verifying countries... Done. (${savedCountries.length} countries found.)`,
    );

    console.log(`Verifying timezones...`);
    const tzItems = await client.request<Timezone[]>(
        readItems(TIMEZONES_COLLECTION),
    );
    const toSaveTimezones = [];
    for (const tz of timezones) {
        const _tz = {
            status: "published" as const,
            name: tz.name,
            offset: tz.offset,
            country: tz.country,
        };
        if (!existsTimezone(_tz)) toSaveTimezones.push(_tz);
    }
    const savedTimezones =
        toSaveTimezones.length > 0
            ? await saveTimezones(toSaveTimezones)
            : tzItems;
    console.log(
        `Verifying timezones... Done. (${savedTimezones.length} timezones found.)`,
    );

    console.log(`Directus geo regions sync... Done.`);

    function existsTimezone(item: (typeof timezones)[0]) {
        return tzItems.some(
            (_item) =>
                _item.name === item.name && _item.country === item.country,
        );
    }

    async function saveTimezones(_items: typeof tzItems) {
        if (_items.length === 0) return Promise.resolve([]);

        console.log(
            `Saving ${_items.map(({ name }) => name).join(", ")} to the db.`,
        );

        return await client.request(createItems(TIMEZONES_COLLECTION, _items));
    }

    function exists(item: (typeof items)[0]) {
        return items.some(
            (_item) =>
                _item.code === item.code &&
                _item.parent === item.parent &&
                _item.type === item.type,
        );
    }

    function findOne(item: (typeof items)[0]) {
        return items.find(
            (_item) =>
                _item.code === item.code &&
                _item.parent === item.parent &&
                _item.type === item.type,
        );
    }

    function findMany(item: { type: string }) {
        return items.filter((_item) => _item.type === item.type);
    }

    async function save(_items: typeof items) {
        if (_items.length === 0) return Promise.resolve([]);

        console.log(
            `Saving ${_items.map(({ code }) => code).join(", ")} to the db.`,
        );

        return await client.request(
            createItems(GEO_REGIONS_COLLECTION, _items),
        );
    }
}
