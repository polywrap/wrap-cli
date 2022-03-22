import { Command, Program } from "./types";

import {
    AppProject,
    CodeGenerator,
    SchemaComposer,
    intlMsg,
    resolvePathIfExistsRefactor,
    defaultAppManifest,
    getSimpleClient,
    getTestEnvProviders,
} from "../lib";

import { Web3ApiClient } from "@web3api/client-js";
import * as path from "path";

const defaultOutputTypesDir = "./src/w3";

export const app: Command = {
    setup: (program: Program) => {

        const appCommand = program
            .command("app")
            .alias("a")
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

    let { manifestFile, codegenDir, ipfs, ens } = options;

    // Resolve manifest
    const manifestPaths = manifestFile ? [manifestFile] : defaultAppManifest;

    manifestFile = resolvePathIfExistsRefactor(manifestPaths)

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

     if (codegenDir) {
         codegenDir = codegenDir;
     } else {
         codegenDir = defaultOutputTypesDir;
     }

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