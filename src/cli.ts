#!/usr/bin/env node

import { Command } from "commander";
import pkg from "../package.json";
import { sync } from "./sync/index";
import { getExecName } from "./lib/getExecName";
import { syncGeoRegions } from "./syncGeoRegions/index";
import { createWebsiteModel } from "./createWebsiteModel/index";
import { readProject } from "./readProject/index";

const program = new Command();

program.name(getExecName()).description(pkg.description).version(pkg.version);

program
    .command("sync", { isDefault: true })
    .requiredOption(
        "-p, --project <string>",
        "Project code in deploy_settings model.",
    )
    .option(
        "-s, --store <string>",
        "Path to store all the data.",
        `[user-home]/directus-sync/[project]`,
    )
    .action(async (options: SyncCmdOpts) => {
        await sync(options);
    });

program.command("sync-geo-regions").action(async () => {
    await syncGeoRegions();
});

program
    .command("create-website-model")
    .requiredOption("--namespace <string>", "A prefix of database tables.")
    .requiredOption(
        "--supported-locales <string...>",
        'List of supported locales. Each formatted as "xx-XX".',
    )
    .option("--owner <string>", "User uuid for the ownership of data.")
    .action(async (options: CreateWebsiteModelCmdOpts) => {
        await createWebsiteModel(options);
    });

program
    .command("read-project")
    .requiredOption(
        "-p, --project <string>",
        "Project code in deploy_settings.",
    )
    .option(
        "-s, --store <string>",
        "Path to the general store.",
        `[user-home]/directus-sync/[project]`,
    )
    .option(
        "--save-path",
        "The path to save the json files in your project.",
        "src/data/[project]",
    )
    .option(
        "--static-path",
        "The path where files reserved for static serving in your project.",
        "public",
    )
    .action(async (options: ReadProjectCmdOpts) => {
        await readProject(options);
    });

program.parse();
