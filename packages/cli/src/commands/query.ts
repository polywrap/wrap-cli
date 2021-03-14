import { fixParameters } from "../lib/helpers/parameters";
import { getIntl } from "../lib/internationalization";

import axios from "axios";
import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import gql from "graphql-tag";
import path from "path";
import { Uri, UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";
import { defineMessages } from "@formatjs/intl";

const intl = getIntl();

const helpMessages = defineMessages({
  t: {
    id: "commands_build_options_t",
    defaultMessage: "Use the development server's ENS instance",
    description: "",
  },
  options: {
    id: "commands_build_options_options",
    defaultMessage: "options",
  },
  script: {
    id: "commands_create_options_recipeScript",
    defaultMessage: "recipe-script",
    description: "code script to use for query",
  },
});
const optionsString = intl.formatMessage(helpMessages.options);

const HELP = `
${chalk.bold("w3 query")} [${optionsString}] ${chalk.bold(`<${intl.formatMessage(helpMessages.script)}>`)}

${optionsString[0].toUpperCase() + optionsString.slice(1)}:
  -t, --test-ens  ${intl.formatMessage(helpMessages.t)}
`;

export default {
  alias: ["q"],
  description: intl.formatMessage({
    id: "commands_query_description",
    defaultMessage: "Query Web3APIs using recipe scripts",
    description: "description of command 'w3 query'",
  }),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;
    // eslint-disable-next-line prefer-const
    let { t, testEns } = parameters.options;

    testEns = testEns || t;

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
      const scriptMissingMessage = intl.formatMessage(
        {
          id: "commands_query_error_missingScript",
          defaultMessage: "Required argument {script} is missing",
          description: "",
        },
        {
          script: `<${intl.formatMessage(helpMessages.script)}>`,
        }
      );
      print.error(scriptMissingMessage);
      print.info(HELP);
      return;
    }

    const {
      data: { ipfs, ethereum },
    } = await axios.get("http://localhost:4040/providers");
    const {
      data: { ensAddress },
    } = await axios.get("http://localhost:4040/ens");

    // TODO: move this into its own package, since it's being used everywhere?
    // maybe have it exported from test-env.
    const redirects: UriRedirect[] = [
      {
        from: new Uri("w3://ens/ethereum.web3api.eth"),
        to: {
          factory: () => new EthereumPlugin({ provider: ethereum }),
          manifest: EthereumPlugin.manifest(),
        },
      },
      {
        from: new Uri("w3://ens/ipfs.web3api.eth"),
        to: {
          factory: () => new IpfsPlugin({ provider: ipfs }),
          manifest: IpfsPlugin.manifest(),
        },
      },
      {
        from: new Uri("w3://ens/ens.web3api.eth"),
        to: {
          factory: () => new EnsPlugin({ address: ensAddress }),
          manifest: EnsPlugin.manifest(),
        },
      },
    ];

    const client = new Web3ApiClient({ redirects });

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
          const readFailMessage = intl.formatMessage(
            {
              id: "commands_query_error_readFail",
              defaultMessage: "Failed to read query {query}",
              description: "",
            },
            {
              query: query,
            }
          );
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
                }
              } else if (typeof value === "object") {
                output[key] = resolveConstants(
                  value as Record<string, unknown>
                );
              } else {
                output[key] = vars[key];
              }
            });

            return output;
          };

          variables = resolveConstants(task.variables);
        }

        if (!uri) {
          const noApiMessage = intl.formatMessage({
            id: "commands_query_error_noApi",
            defaultMessage: "API needs to be initialized",
            description: "",
          });
          throw Error(noApiMessage);
        }

        print.warning("-----------------------------------");
        print.fancy(query);
        print.fancy(JSON.stringify(variables, null, 2));
        print.warning("-----------------------------------");

        const { data, errors } = await client.query({
          uri: new Uri(uri),
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
