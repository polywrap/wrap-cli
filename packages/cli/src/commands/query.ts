import {
  Ethereum,
  IPFS,
  Subgraph,
  Web3API
} from "@web3api/client-js";
import { withSpinner } from "../lib/helpers/spinner";
import { fixParameters } from "../lib/helpers/parameters";

import path from "path";
import axios from "axios";
import chalk from "chalk";
import { GluegunToolbox, print } from "gluegun";
import gql from "graphql-tag";

const HELP = `
${chalk.bold('w3 query')} [options] ${chalk.bold('[<recipe-script>]')}

Options:
  -t, --test-ens  Use the development server's ENS instance
`;

export default {
  alias: ["q"],
  description: "Query Web3APIs using recipe scripts",
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, parameters, print } = toolbox;
    let {
      t, testEns
    } = parameters.options;

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
      print.error(e.message);
      process.exitCode = 1;
      return;
    }

    const { data: { ipfs, ethereum, subgraph } } = await axios.get("http://localhost:4040/providers");
    const { data: { ensAddress } } = await axios.get("http://localhost:4040/ens");

    const recipe = JSON.parse(filesystem.read(recipePath) as string);
    const dir = path.dirname(recipePath);

    let api: Web3API | undefined = undefined;
    let constants: any = { }
    for (const task of recipe) {
      if (task.api) {
        api = new Web3API({
          uri: task.api,
          portals: {
            ipfs: new IPFS({ provider: ipfs }),
            ethereum: new Ethereum({ provider: ethereum, ens: ensAddress }),
            subgraph: new Subgraph({ provider: subgraph })
          }
        });
      }

      if (task.constants) {
        constants = JSON.parse(
          filesystem.read(path.join(dir, task.constants)) as string
        );
      }

      if (task.query) {
        const query = filesystem.read(path.join(dir, task.query))

        if (!query) {
          throw Error(`Failed to read query ${query}`);
        }

        let variables: any = { }

        if (task.variables) {
          variables = { ...task.variables }

          Object.keys(variables).forEach((key: string) => {
            if (typeof variables[key] === "string") {
              if (variables[key][0] === '$') {
                variables[key] = constants[variables[key].replace('$', '')]
              }
            }
          })
        }

        if (!api) {
          throw Error("API needs to be initialized");
        }

        const { data } = await api.query({
          query: gql(query),
          variables
        })

        print.success('-----------------------------------')
        print.fancy(JSON.stringify(data, null, 2))
        print.success('-----------------------------------')
      }
    }

    // Setup Web3API
    // Iterate through recipe and execute it

  }
}
