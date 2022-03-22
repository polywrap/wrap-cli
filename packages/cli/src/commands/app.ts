import { Command, Program } from "./types";
import fs from 'fs';
import {
    AppProject,
    CodeGenerator,
    SchemaComposer,
    intlMsg,
    //fixParameters,
    //resolvePathIfExists,
    defaultAppManifest,
    getSimpleClient,
    getTestEnvProviders,
} from "../lib";

import { Web3ApiClient } from "@web3api/client-js";
import * as path from "path";


export const app: Command = {
    setup: (program: Program) => {

        const defaultOutputTypesDir = "./src/w3";

        const appCommand = program
            .alias("a")
            .command("app")
            .description(intlMsg.commands_app_description())

        appCommand
            .command("codegen")
            .description(intlMsg.commands_app_codegen())
            .option(`-m, --manifest-file <${intlMsg.commands_codegen_options_o_path()}>`, intlMsg.commands_app_options_codegen(
                {
                    default: defaultOutputTypesDir,
                }
            ))
            .option(`-c, --codegen-dir <${intlMsg.commands_codegen_options_o_path()}>`, `${intlMsg.commands_app_options_codegen(
                {
                    default: defaultOutputTypesDir,
                }
            )}`)
            .option(`-i, --ipfs [<${intlMsg.commands_codegen_options_i_node()}>] `, `${intlMsg.commands_codegen_options_i()}`)
            .option(`-e, --ens [<${intlMsg.commands_codegen_options_e_address()}>]`, `${intlMsg.commands_codegen_options_e()}`)
            .action(async (options) => {
                await run(options);
            });
    }
}

async function run(options: any) {

    console.log(options)

    let { codegenDir, ipfs, ens } = options;

    // Resolve manifest
    const manifestPaths = options.manifestFile ? [options.manifestFile] : defaultAppManifest;

    function resolvePathIfExists(
        searchPaths: string[]
    ): string | undefined {
        for (let i = 0; i < manifestPaths.length; i++) {
            if (fs.existsSync(searchPaths[i])) {
                return searchPaths[i];
            }
        }
        return undefined;
    }

    let manifestFile = resolvePathIfExists(manifestPaths)

    if (!manifestFile) {
        console.error(
            intlMsg.commands_app_error_manifestNotFound({
                paths: manifestPaths.join(", "),
            })
        );
        return;
    }

    // Get providers and client
    const { ipfsProvider, ethProvider } = await getTestEnvProviders(ipfs);
    const ensAddress: string | undefined = ens;
    const client: Web3ApiClient = getSimpleClient({
        ensAddress,
        ethProvider,
        ipfsProvider,
    });

    // App project
    const project = new AppProject({
        rootCacheDir: path.dirname(manifestFile),
        appManifestPath: manifestFile,
        client,
    });
    await project.validate();

    // TODO
    // if (codegenDir) {
    //     codegenDir = filesystem.resolve(codegenDir);
    // } else {
    //     codegenDir = filesystem.resolve(defaultOutputTypesDir);
    // }

    const schemaComposer = new SchemaComposer({
        project,
        client,
    });
    const codeGenerator = new CodeGenerator({
        project,
        schemaComposer,
        outputDir: codegenDir,
    });


    if (await codeGenerator.generate()) {
        console.log(`🔥 ${intlMsg.commands_app_success()} 🔥`);
        process.exitCode = 0;
    } else {
        process.exitCode = 1;
    }
}