import { Command, Program } from "./types";
import fs from 'fs';
import {
    //AppProject,
    //CodeGenerator,
    //SchemaComposer,
    intlMsg,
    //fixParameters,
    //resolvePathIfExists,
    defaultAppManifest,
    // getSimpleClient,
    // getTestEnvProviders,
  } from "../lib";


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
            .option(`-c, --codegen-dir <${intlMsg.commands_codegen_options_o_path()}>`,  `${intlMsg.commands_app_options_codegen(
                {
                  default: defaultOutputTypesDir,
                }
              )}`)
            .option(`-i, --ipfs [<${intlMsg.commands_codegen_options_i_node()}>] `,  `${intlMsg.commands_codegen_options_i()}`)
            .option(`-e, --ens [<${intlMsg.commands_codegen_options_e_address()}>]`,   `${intlMsg.commands_codegen_options_e()}`)
            .action(async (options) => {
                await run(options);
            });
    }
}

async function run(options:any) {

        console.log(options)
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

        // TODO 
        // add the rest of the logic 
}