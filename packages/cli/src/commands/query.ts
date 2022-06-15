import { Command, Program } from "./types";
import {
  intlMsg,
  parseClientConfigOption,
  parseRecipeOutputFilePathOption,
} from "../lib";

import { PolywrapClient, Web3ApiClientConfig } from "@polywrap/client-js";
import gql from "graphql-tag";
import path from "path";
import yaml from "js-yaml";
import fs from "fs";

type QueryCommandOptions = {
  clientConfig: Partial<Web3ApiClientConfig>;
  outputFile?: string;
  quiet?: boolean;
};

export const query: Command = {
  setup: (program: Program) => {
    program
      .command("query")
      .alias("q")
      .description(intlMsg.commands_query_description())
      .argument("<recipe>", intlMsg.commands_query_options_recipeScript())
      .option(
        `-c, --client-config <${intlMsg.commands_query_options_configPath()}> `,
        `${intlMsg.commands_query_options_config()}`
      )
      .option(
        `-o, --output-file <${intlMsg.commands_query_options_outputFilePath()}>`,
        `${intlMsg.commands_query_options_outputFile()}`
      )
      .option(`-q, --quiet`, `${intlMsg.commands_query_options_quiet()}`)
      .action(async (recipe: string, options) => {
        await run(recipe, {
          ...options,
          clientConfig: await parseClientConfigOption(
            options.clientConfig,
            undefined
          ),
          outputFile: options.outputFile
            ? parseRecipeOutputFilePathOption(options.outputFile, undefined)
            : undefined,
        });
      });
  },
};

async function run(recipePath: string, options: QueryCommandOptions) {
  const { clientConfig, outputFile, quiet } = options;
  const client = new PolywrapClient(clientConfig);

  function getParser(path: string) {
    return path.endsWith(".yaml") || path.endsWith(".yml")
      ? yaml.load
      : JSON.parse;
  }

  const recipe = getParser(recipePath)(fs.readFileSync(recipePath).toString());
  const dir = path.dirname(recipePath);
  let uri = "";
  const recipeOutput = [];

  let constants: Record<string, string> = {};
  for (const task of recipe) {
    if (task.api) {
      uri = task.api;
      recipeOutput.push({ api: task.api });
    }

    if (task.constants) {
      constants = getParser(task.constants)(
        fs.readFileSync(path.join(dir, task.constants)).toString()
      );
      recipeOutput.push({ constants: task.constants });
    }

    if (task.query) {
      const query = fs.readFileSync(path.join(dir, task.query)).toString();

      if (!query) {
        const readFailMessage = intlMsg.commands_query_error_readFail({
          query: query ?? "undefined",
        });
        console.error(readFailMessage);
        process.exit(1);
      }

      let variables: Record<string, unknown> = {};

      if (task.variables) {
        const resolveObjectConstants = (
          constants: Record<string, unknown>
        ): Record<string, unknown> => {
          const output: Record<string, unknown> = {};

          Object.keys(constants).forEach((key: string) => {
            output[key] = resolveConstant(constants[key]);
          });

          return output;
        };

        const resolveArrayConstants = (arr: unknown[]): unknown[] => {
          return arr.map((item) => {
            return resolveConstant(item);
          });
        };

        const resolveConstant = (constant: unknown): unknown => {
          if (typeof constant === "string" && constant[0] === "$") {
            return constants[constant.replace("$", "")];
          } else if (Array.isArray(constant)) {
            return resolveArrayConstants(constant);
          } else if (typeof constant === "object") {
            return resolveObjectConstants(constant as Record<string, unknown>);
          } else {
            return constant;
          }
        };

        variables = resolveObjectConstants(task.variables);
      }

      if (!uri) {
        throw Error(intlMsg.commands_query_error_noApi());
      }

      if (!quiet) {
        console.log("-----------------------------------");
        console.log(query);
        console.log(JSON.stringify(variables, null, 2));
        console.log("-----------------------------------");
      }

      const { data, errors } = await client.query({
        uri,
        query: gql(query),
        variables,
      });

      if (outputFile) {
        recipeOutput.push({
          query: task.query,
          variables: task.variables,
          output: {
            data,
            errors,
          },
        });
      }

      if (!quiet && data && data !== {}) {
        console.log("-----------------------------------");
        console.log(JSON.stringify(data, null, 2));
        console.log("-----------------------------------");
      }

      if (!quiet && errors) {
        for (const error of errors) {
          console.log("-----------------------------------");
          console.log(error.message);
          console.log(error.stack || "");
          console.log("-----------------------------------");
        }
        process.exitCode = 1;
      }
    }

    if (outputFile) {
      const outputFileExt = path.extname(outputFile).substring(1);
      if (!outputFileExt) throw new Error("Require output file extention");
      switch (outputFileExt) {
        case "yaml":
        case "yml":
          fs.writeFileSync(outputFile, yaml.dump(recipeOutput));
          break;
        case "json":
          fs.writeFileSync(outputFile, JSON.stringify(recipeOutput));
          break;
        default:
          throw new Error(`Unsupported outputFile extention: ${outputFileExt}`);
      }
    }
  }
}
