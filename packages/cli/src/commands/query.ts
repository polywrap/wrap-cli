import { getParserForFile } from "../lib/helpers";
import { getTestEnvClientConfig } from "../lib/helpers/test-env-client-config";
import { importTs } from "../lib/helpers/import-ts";
import { fixParameters } from "../lib/helpers";
import { validateClientConfig } from "../lib/helpers/validate-client-config";
import { intlMsg } from "../lib/intl";

import { Web3ApiClient, Web3ApiClientConfig } from "@web3api/client-js";
import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import gql from "graphql-tag";
import path from "path";

const i18n = {
  apiMissing: intlMsg.commands_query_error_noApi(),
  args: intlMsg.commands_query_arguments_recipes(),
  clientConfigBadFileExt:
    intlMsg.commands_query_error_clientConfigInvalidFileExt,
  clientConfigMissingExport:
    intlMsg.commands_query_error_clientConfigModuleMissingExport,
  clientConfigMissingPath: intlMsg.commands_query_error_clientConfigMissingPath,
  config: intlMsg.commands_query_options_config(),
  configPath: intlMsg.commands_query_options_configPath(),
  description: intlMsg.commands_query_description(),
  file: intlMsg.commands_create_options_recipeScript(),
  fileDescription: intlMsg.commands_query_options_fileDescription(),
  missingCookbookFile: intlMsg.commands_query_error_missingScript,
  noTestEnvFound: intlMsg.commands_query_error_noTestEnvFound(),
  options: intlMsg.commands_build_options_options(),
  testEns: intlMsg.commands_build_options_t(),
};

const HELP = `
${chalk.bold("w3 query")} [${i18n.options}] ${chalk.bold(i18n.args)}

${i18n.options[0].toUpperCase() + i18n.options.slice(1)}:
  -f, --cookbook-file <${i18n.file}>   ${i18n.fileDescription}
  -t, --test-ens ${i18n.testEns}
  -c, --client-config <${i18n.configPath}>   ${i18n.config}
`;

export default {
  alias: ["q"],
  description: i18n.description,
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print, middleware } = toolbox;
    // eslint-disable-next-line prefer-const
    let { t, testEns, c, clientConfig, f, cookbookFile } = parameters.options;

    testEns = testEns || t;
    clientConfig = clientConfig || c;
    cookbookFile = cookbookFile || f;

    let queries: string[];
    try {
      queries = fixParameters(
        {
          options: toolbox.parameters.options,
          array: toolbox.parameters.array,
        },
        {
          t,
          testEns,
        }
      );
    } catch (e) {
      print.error(e.message);
      process.exitCode = 1;
      return;
    }

    if (!cookbookFile) {
      print.error(i18n.missingCookbookFile({ script: `-f ${i18n.file}` }));
      print.info(HELP);
      return;
    }

    if (clientConfig === true) {
      print.error(
        i18n.clientConfigMissingPath({
          option: "--client-config",
          argument: `<${i18n.configPath}>`,
        })
      );
      print.info(HELP);
      return;
    }

    let finalClientConfig: Partial<Web3ApiClientConfig>;
    try {
      finalClientConfig = await getTestEnvClientConfig();
    } catch (e) {
      print.error(i18n.noTestEnvFound);
      process.exitCode = 1;
      return;
    }
    if (clientConfig) {
      let configModule;
      if (clientConfig.endsWith(".js")) {
        configModule = await import(filesystem.resolve(clientConfig));
      } else if (clientConfig.endsWith(".ts")) {
        configModule = await importTs(filesystem.resolve(clientConfig));
      } else {
        print.error(i18n.clientConfigBadFileExt({ module: clientConfig }));
        process.exitCode = 1;
        return;
      }
      if (!configModule || !configModule.getClientConfig) {
        print.error(i18n.clientConfigMissingExport({ module: configModule }));
        process.exitCode = 1;
        return;
      }

      finalClientConfig = configModule.getClientConfig(finalClientConfig);
      try {
        validateClientConfig(finalClientConfig);
      } catch (e) {
        print.error(e.message);
        process.exitCode = 1;
        return;
      }
    }

    await middleware.run({
      name: toolbox.command?.name,
      options: { testEns, recipePath: cookbookFile },
    });

    const client = new Web3ApiClient(finalClientConfig);
    const cookbook = getParserForFile(cookbookFile)(
      filesystem.read(cookbookFile) as string
    );
    const dir = path.dirname(cookbookFile);
    const api = cookbook.api;
    let constants: Record<string, string> = {};

    if (!!cookbook.constants)
      constants = getParserForFile(cookbook.constants)(
        filesystem.read(path.join(dir, cookbook.constants)) as string
      );

    /*for (const task of recipe) {
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
          throw Error(i18n.apiMissing);
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
    }*/
  },
};
