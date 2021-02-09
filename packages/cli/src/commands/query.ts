import { fixParameters } from "../lib/helpers/parameters";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import axios from "axios";
import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import gql from "graphql-tag";
import path from "path";
import { Uri, UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HELP = `
${chalk.bold("w3 query")} [options] ${chalk.bold("<recipe-script>")}

Options:
  -t, --test-ens  Use the development server's ENS instance
`;

export default {
  alias: ["q"],
  description: "Query Web3APIs using recipe scripts",
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
      print.error("Required argument <recipe-script> is missing");
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
          throw Error(`Failed to read query ${query}`);
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
          throw Error("API needs to be initialized");
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
