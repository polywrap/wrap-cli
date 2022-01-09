import { Web3ApiClient, Web3ApiClientConfig } from "@web3api/client-js";
import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import gql from "graphql-tag";
import path from "path";
import { getDefaultClientConfig } from "../lib/helpers/default-client-config";
import { importTs } from "../lib/helpers/import-ts";
import { fixParameters } from "../lib/helpers/parameters";
import { validateConfigs } from "../lib/helpers/validate-configs";
import { intlMsg } from "../lib/intl";

const optionsString = intlMsg.commands_build_options_options();
const scriptStr = intlMsg.commands_create_options_recipeScript();
const configPathStr = intlMsg.commands_query_options_configPath();

const HELP = `
${chalk.bold("w3 query")} [${optionsString}] ${chalk.bold(`<${scriptStr}>`)}

${optionsString[0].toUpperCase() + optionsString.slice(1)}:
  -t, --test-ens  ${intlMsg.commands_build_options_t()}
  -c, --configs <${configPathStr}> ${intlMsg.commands_query_options_config()}
`;

export default {
  alias: ["q"],
  description: intlMsg.commands_query_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print, middleware } = toolbox;
    // eslint-disable-next-line prefer-const
    let { t, testEns, c, configs } = parameters.options;

    testEns = testEns || t;
    configs = configs || c;

    let recipePath;
    try {
      const params = toolbox.parameters;
      [recipePath] = fixParameters(
        {
          options: params.options,
          array: params.array,
        },
        {
          t,
          testEns,
        }
      );
    } catch (e) {
      recipePath = null;
      print.error(e.message);
      process.exitCode = 1;
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

    if (configs === true) {
      const confgisMissingPathMessage = intlMsg.commands_query_error_configsMissingPath(
        {
          option: "--configs",
          argument: `<${configPathStr}>`,
        }
      );
      print.error(confgisMissingPathMessage);
      print.info(HELP);
      return;
    }

    let aggregatedConfigs: Partial<Web3ApiClientConfig> = {};
    let defaultClientConfig: Partial<Web3ApiClientConfig>;

    try {
      defaultClientConfig = await getDefaultClientConfig();
    } catch (e) {
      print.error(intlMsg.commands_query_error_noTestEnvFound());
      process.exitCode = 1;
      return;
    }

    if (configs) {
      let configsModule;
      if (configs.endsWith(".js")) {
        configsModule = await import(filesystem.resolve(configs));
      } else if (configs.endsWith(".ts")) {
        configsModule = await importTs(filesystem.resolve(configs));
      } else {
        const configsModuleMissingExportMessage = intlMsg.commands_query_error_configsInvalidFileExt(
          { module: configs }
        );
        print.error(configsModuleMissingExportMessage);
        process.exitCode = 1;
        return;
      }

      console.log(configsModule);

      if (!configsModule || !configsModule.getConfigs) {
        const configsModuleMissingExportMessage = intlMsg.commands_query_error_configsModuleMissingExport(
          { module: configs }
        );
        print.error(configsModuleMissingExportMessage);
        process.exitCode = 1;
        return;
      }

      aggregatedConfigs = configsModule.getConfigs(defaultClientConfig);

      try {
        validateConfigs(aggregatedConfigs);
      } catch (e) {
        print.error(e.message);
        process.exitCode = 1;
        return;
      }
    }

    await middleware.run({
      name: toolbox.command?.name,
      options: { testEns, recipePath },
    });

    const client = new Web3ApiClient(
      aggregatedConfigs ? aggregatedConfigs : defaultClientConfig
    );

    const recipe = JSON.parse(filesystem.read(recipePath) as string);
    const dir = path.dirname(recipePath);
    let uri = "";

    let constants: Record<string, string> = {};
    for (const task of recipe) {
      if (task.api) {
        uri = task.api;
      }

      if (task.constants) {
        constants = JSON.parse(
          filesystem.read(path.join(dir, task.constants)) as string
        );
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

        print.warning("-----------------------------------");
        print.fancy(query);
        print.fancy(JSON.stringify(variables, null, 2));
        print.warning("-----------------------------------");

        const { data, errors } = await client.query({
          uri,
          query: gql(query),
          variables,
        });

        if (data && data !== {}) {
          print.success("-----------------------------------");
          print.fancy(JSON.stringify(data, null, 2));
          print.success("-----------------------------------");
        }

        if (errors) {
          for (const error of errors) {
            print.error("-----------------------------------");
            print.fancy(error.message);
            print.fancy(error.stack || "");
            print.error("-----------------------------------");
          }
        }
      }
    }
  },
};
