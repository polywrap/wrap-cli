import { Command, Program } from "./types";
import {
    intlMsg,
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
            .action(async (options) => {
                console.log(options);
            });
    }
}