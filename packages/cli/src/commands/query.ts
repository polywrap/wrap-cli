// TODO check if query works!
import { Command, Program } from "./types";
import {
  getTestEnvClientConfig,
  importTypescriptModule,
  validateClientConfig,
  fixParameters,
  intlMsg,
} from "../lib";

import { Web3ApiClient, Web3ApiClientConfig } from "@web3api/client-js";
import chalk from "chalk";
import * as jetpack from "fs-jetpack";

import gql from "graphql-tag";
import path from "path";
import yaml from "js-yaml";

const optionsString = intlMsg.commands_build_options_options();
const scriptStr = intlMsg.commands_create_options_recipeScript();
const configPathStr = intlMsg.commands_query_options_configPath();

const HELP = `
${chalk.bold("w3 query")} [${optionsString}] ${chalk.bold(`<${scriptStr}>`)}

${optionsString[0].toUpperCase() + optionsString.slice(1)}:
  -t, --test-ens  ${intlMsg.commands_build_options_t()}
  -c, --client-config <${configPathStr}> ${intlMsg.commands_query_options_config()}
`;


export const query: Command = {
  setup: (program: Program) => {
    program
      .command("query")
      .alias("q")
      .description(intlMsg.commands_query_description())
      .option(`-t, --test-ens`, `${intlMsg.commands_build_options_t()}`)
      .option(`-c, --client-config <${configPathStr}> `, `${intlMsg.commands_query_options_config()}`)
      .action(async (options) => {
        await run(options);
      });
  }
}


async function run(options: any) {
  let { testEns, clientConfig } = options;
  console.log(options);
  console.log(testEns)
  console.log(clientConfig);
  let recipePath = testEns;
  try {
    const params = options;
    [recipePath] = fixParameters(
      {
        options: options,
        array: params.array,
      },
      {
        testEns,
      }
    );
  } catch (e) {
    recipePath = null;
    console.error(e.message);
    process.exitCode = 1;
    return;
  }

  if (!recipePath) {
    const scriptMissingMessage = intlMsg.commands_query_error_missingScript({
      script: `<${scriptStr}>`,
    });
    console.error(scriptMissingMessage);
    console.info(HELP);
    return;
  }

  if (clientConfig === true) {
    const confgisMissingPathMessage = intlMsg.commands_query_error_clientConfigMissingPath(
      {
        option: "--client-config",
        argument: `<${configPathStr}>`,
      }
    );
    console.error(confgisMissingPathMessage);
    console.info(HELP);
    return;
  }

  let finalClientConfig: Partial<Web3ApiClientConfig>;

  try {
    finalClientConfig = await getTestEnvClientConfig();
  } catch (e) {
    console.error(intlMsg.commands_query_error_noTestEnvFound());
    process.exitCode = 1;
    return;
  }

  if (clientConfig) {
    let configModule;
    if (clientConfig.endsWith(".js")) {
      configModule = await import(path.resolve(clientConfig));
    } else if (clientConfig.endsWith(".ts")) {
      configModule = await importTypescriptModule(
        path.resolve(clientConfig)
      );
    } else {
      const configsModuleMissingExportMessage = intlMsg.commands_query_error_clientConfigInvalidFileExt(
        { module: clientConfig }
      );
      console.error(configsModuleMissingExportMessage);
      process.exitCode = 1;
      return;
    }

    if (!configModule || !configModule.getClientConfig) {
      const configsModuleMissingExportMessage = intlMsg.commands_query_error_clientConfigModuleMissingExport(
        { module: configModule }
      );
      console.error(configsModuleMissingExportMessage);
      process.exitCode = 1;
      return;
    }

    finalClientConfig = configModule.getClientConfig(finalClientConfig);

    try {
      validateClientConfig(finalClientConfig);
    } catch (e) {
      console.error(e.message);
      process.exitCode = 1;
      return;
    }
  }

  const client = new Web3ApiClient(finalClientConfig);

  function getParser(path: string) {
    return path.endsWith(".yaml") || path.endsWith(".yml")
      ? yaml.load
      : JSON.parse;
  }

  const recipe = getParser(recipePath)(jetpack.read(recipePath) as string);
  const dir = path.dirname(recipePath);
  let uri = "";

  let constants: Record<string, string> = {};
  for (const task of recipe) {
    if (task.api) {
      uri = task.api;
    }

    if (task.constants) {
      constants = getParser(task.constants)(
        jetpack.read(path.join(dir, task.constants)) as string
      );
    }

    if (task.query) {
      const query = jetpack.read(path.join(dir, task.query));

      if (!query) {
        const readFailMessage = intlMsg.commands_query_error_readFail({
          query: query ?? "undefined",
        });
        throw Error(readFailMessage);
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
            return resolveObjectConstants(
              constant as Record<string, unknown>
            );
          } else {
            return constant;
          }
        };

        variables = resolveObjectConstants(task.variables);
      }

      if (!uri) {
        throw Error(intlMsg.commands_query_error_noApi());
      }

      console.log("-----------------------------------");
      console.log(query);
      console.log(JSON.stringify(variables, null, 2));
      console.log("-----------------------------------");

      const { data, errors } = await client.query({
        uri,
        query: gql(query),
        variables,
      });

      if (data && data !== {}) {
        console.log("-----------------------------------");
        console.log(JSON.stringify(data, null, 2));
        console.log("-----------------------------------");
      }

      if (errors) {
        for (const error of errors) {
          console.log("-----------------------------------");
          console.log(error.message);
          console.log(error.stack || "");
          console.log("-----------------------------------");
        }
        process.exitCode = 1;
      }
    }
  }
}