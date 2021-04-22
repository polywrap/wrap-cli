import { fixParameters } from "../lib/helpers/parameters";
import { intlMsg } from "../lib/intl";

import axios from "axios";
import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import gql from "graphql-tag";
import path from "path";
import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";

const optionsString = intlMsg.commands_build_options_options();
const scriptStr = intlMsg.commands_create_options_recipeScript();
const pathStr = intlMsg.commands_query_options_r_path();

const HELP = `
${chalk.bold("w3 query")} [${optionsString}] ${chalk.bold(`<${scriptStr}>`)}

${optionsString[0].toUpperCase() + optionsString.slice(1)}:
  -t, --test-ens  ${intlMsg.commands_build_options_t()}
  -r, --redirects <${pathStr}> ${intlMsg.commands_query_options_r()}
`;

export default {
  alias: ["q"],
  description: intlMsg.commands_query_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;
    // eslint-disable-next-line prefer-const
    let { t, testEns, r, redirects } = parameters.options;

    testEns = testEns || t;
    redirects = redirects || r;

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

    if (redirects === true) {
      const redirectsPathMissingPathMessage = intlMsg.commands_query_error_redirectsPathMissingPath(
        {
          option: "--redirects",
          argument: `<${pathStr}>`,
        }
      );
      print.error(redirectsPathMissingPathMessage);
      print.info(HELP);
      return;
    }

    let ipfsProvider = "";
    let ethereumProvider = "";
    let ensAddress = "";

    try {
      const {
        data: { ipfs, ethereum },
      } = await axios.get("http://localhost:4040/providers");
      ipfsProvider = ipfs;
      ethereumProvider = ethereum;
      const { data } = await axios.get("http://localhost:4040/ens");
      ensAddress = data.ensAddress;
    } catch (e) {
      print.error(`w3 test-env not found, please run "w3 test-env up"`);
      return;
    }

    // TODO: move this into its own package, since it's being used everywhere?
    // maybe have it exported from test-env.
    const testEnvRedirects: UriRedirect[] = [
      {
        from: "w3://ens/ethereum.web3api.eth",
        to: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethereumProvider,
            },
            mainnet: {
              provider:
                "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
            },
          },
        }),
      },
      {
        from: "w3://ens/ipfs.web3api.eth",
        to: ipfsPlugin({
          provider: ipfsProvider,
          fallbackProviders: ["https://ipfs.io"],
        }),
      },
      {
        from: "w3://ens/ens.web3api.eth",
        to: ensPlugin({
          addresses: {
            testnet: ensAddress,
          },
        }),
      },
    ];

    const customRedirects: UriRedirect[] = [];

    if (redirects) {
      const redirectsModule = await import(filesystem.resolve(redirects));

      if (!redirectsModule || !redirectsModule.redirects) {
        const redirectsModuleMissingExportMessage = intlMsg.commands_query_error_redirectsModuleMissingExport(
          { module: redirects }
        );
        print.error(redirectsModuleMissingExportMessage);
      }

      const importedRedirects = redirectsModule.redirects;

      // Ensure the redirects exported by the module is an array
      if (
        typeof importedRedirects !== "object" ||
        importedRedirects.length === undefined ||
        typeof importedRedirects.length !== "number"
      ) {
        print.error(intlMsg.commands_query_error_redirectsExportNotArray());
        return;
      }

      // Ensure each redirect in the array is valid
      for (let i = 0; i < importedRedirects.length; ++i) {
        const redirect = importedRedirects[i];

        if (typeof redirect !== "object" || !redirect.from || !redirect.to) {
          print.error(intlMsg.commands_query_error_redirectsItemNotValid(
            { index: i.toString() }
          ));
          return;
        } else if (typeof redirect.from !== "string") {
          print.error(intlMsg.commands_query_error_redirectsItemFromNotString(
            { index: i.toString() }
          ));
          return;
        } else if (typeof redirect.to !== "string" && typeof redirect.to !== "object") {
          print.error(intlMsg.commands_query_error_redirectsItemToNotStringOrObject(
            { index: i.toString() }
          ));
          return;
        } else if (typeof redirect.to === "object" && (
          typeof redirect.to.factory !== "function" ||
          typeof redirect.to.manifest !== "object"
        )) {
          print.error(intlMsg.commands_query_error_redirectsItemToNotValidPlugin(
            { index: i.toString() }
          ));
          return;
        }
      }

      customRedirects.push(...redirectsModule.redirects);
    }

    const client = new Web3ApiClient({
      redirects: [
        ...customRedirects,
        ...testEnvRedirects
      ]
    });

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
          const resolveConstants = (
            vars: Record<string, unknown>
          ): Record<string, unknown> => {
            const output: Record<string, unknown> = {};

            Object.keys(vars).forEach((key: string) => {
              const value = vars[key];
              if (typeof value === "string") {
                if (value[0] === "$") {
                  output[key] = constants[value.replace("$", "")];
                } else {
                  output[key] = value;
                }
              } else if (typeof value === "object") {
                output[key] = resolveConstants(
                  value as Record<string, unknown>
                );
              } else {
                output[key] = value;
              }
            });

            return output;
          };

          variables = resolveConstants(task.variables);
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
            print.error("-----------------------------------");
          }
        }
      }
    }

    // Setup Web3API
    // Iterate through recipe and execute it
  },
};
