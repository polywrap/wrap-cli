import {
  getTestEnvClientConfig,
  importTypescriptModule,
  validateClientConfig,
  fixParameters,
  intlMsg,
} from "../lib";

import {
  executeMaybeAsyncFunction,
  Web3ApiClient,
  Web3ApiClientConfig,
} from "@web3api/client-js";
import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import gql from "graphql-tag";
import path from "path";
import yaml from "js-yaml";
import fs from "fs";

const optionsString = intlMsg.commands_build_options_options();
const scriptStr = intlMsg.commands_create_options_recipeScript();
const configPathStr = intlMsg.commands_query_options_configPath();
const outputFileStr = intlMsg.commands_query_options_outputFile();

const HELP = `
${chalk.bold("w3 query")} [${optionsString}] ${chalk.bold(`<${scriptStr}>`)}

${optionsString[0].toUpperCase() + optionsString.slice(1)}:
  -h, --help                         ${intlMsg.commands_build_options_h()}
  -c, --client-config <${configPathStr}>  ${intlMsg.commands_query_options_config()}
  -o, --output-file                  ${intlMsg.commands_query_options_outputFile()}
  -q, --quiet                        ${intlMsg.commands_query_options_quiet()}
`;

export default {
  alias: ["q"],
  description: intlMsg.commands_query_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    let { help, clientConfig, outputFile, quiet } = parameters.options;
    const { h, c, o, q } = parameters.options;

    help = help || h;
    clientConfig = clientConfig || c;
    outputFile = outputFile || o;
    quiet = quiet || q;

    let recipePath;
    try {
      const params = toolbox.parameters;
      [recipePath] = fixParameters(
        {
          options: params.options,
          array: params.array,
        },
        {
          h,
          help,
        }
      );
    } catch (e) {
      recipePath = null;
      print.error(e.message);
      process.exitCode = 1;
      return;
    }

    if (help) {
      print.info(HELP);
      return;
    }

    if (!recipePath) {
      const scriptMissingMessage = intlMsg.commands_query_error_missingScript({
        script: `<${scriptStr}>`,
      });
      print.error(scriptMissingMessage);
      print.info(HELP);
      return;
    }

    if (outputFile === true) {
      const outputFileMissingMessage = intlMsg.commands_query_error_outputFileMissing(
        {
          option: "--output-file",
          argument: `<${outputFileStr}>`,
        }
      );
      print.error(outputFileMissingMessage);
      print.info(HELP);
      return;
    }

    if (clientConfig === true) {
      const configMissingPathMessage = intlMsg.commands_query_error_clientConfigMissingPath(
        {
          option: "--client-config",
          argument: `<${configPathStr}>`,
        }
      );
      print.error(configMissingPathMessage);
      print.info(HELP);
      return;
    }

    let finalClientConfig: Partial<Web3ApiClientConfig>;

    try {
      finalClientConfig = await getTestEnvClientConfig();
    } catch (e) {
      print.error(intlMsg.commands_query_error_noTestEnvFound());
      process.exitCode = 1;
      return;
    }

    if (clientConfig) {
      let configModule;
      if (clientConfig.endsWith(".js")) {
        configModule = await import(filesystem.resolve(clientConfig));
      } else if (clientConfig.endsWith(".ts")) {
        configModule = await importTypescriptModule(
          filesystem.resolve(clientConfig)
        );
      } else {
        const configsModuleMissingExportMessage = intlMsg.commands_query_error_clientConfigInvalidFileExt(
          { module: clientConfig }
        );
        print.error(configsModuleMissingExportMessage);
        process.exitCode = 1;
        return;
      }

      if (!configModule || !configModule.getClientConfig) {
        const configsModuleMissingExportMessage = intlMsg.commands_query_error_clientConfigModuleMissingExport(
          { module: configModule }
        );
        print.error(configsModuleMissingExportMessage);
        process.exitCode = 1;
        return;
      }

      finalClientConfig = await executeMaybeAsyncFunction(
        configModule.getClientConfig,
        finalClientConfig
      );

      try {
        validateClientConfig(finalClientConfig);
      } catch (e) {
        print.error(e.message);
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

    const recipe = getParser(recipePath)(filesystem.read(recipePath) as string);
    const dir = path.dirname(recipePath);
    let uri = "";
    const recipeOutput = [];

    let constants: Record<string, string> = {};
    for (const task of recipe) {
      if (task.api) {
        uri = task.api;
        recipeOutput.push({
          api: task.api,
        });
      }

      if (task.constants) {
        constants = getParser(task.constants)(
          filesystem.read(path.join(dir, task.constants)) as string
        );
        recipeOutput.push({
          constants: task.constants,
        });
      }

      if (task.query) {
        const query = filesystem.read(path.join(dir, task.query));

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

        if (!quiet) {
          print.warning("-----------------------------------");
          print.fancy(query);
          print.fancy(JSON.stringify(variables, null, 2));
          print.warning("-----------------------------------");
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
          print.success("-----------------------------------");
          print.fancy(JSON.stringify(data, null, 2));
          print.success("-----------------------------------");
        }

        if (!quiet && errors) {
          for (const error of errors) {
            print.error("-----------------------------------");
            print.fancy(error.message);
            print.fancy(error.stack || "");
            print.error("-----------------------------------");
          }
          process.exitCode = 1;
        }
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
  },
};
