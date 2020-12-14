import { Compiler } from "../lib/Compiler";
import { fixParameters } from "../lib/helpers/parameters";
import { publishToIPFS } from "../lib/publishers/ipfs-publisher";
import { publishToSubgraph } from "../lib/publishers/subgraph-publisher";

import path from "path";
import chalk from "chalk";
import axios from "axios";
import { GluegunToolbox } from "gluegun";

const HELP = `
${chalk.bold('w3 build')} [options] ${chalk.bold('[<web3api-manifest>]')}

Options:
  -h, --help                         Show usage information
  -i, --ipfs <node>                  Upload build results to an IPFS node
  -g, --graph <name,node>            Upload build results to a Graph node under "name" (require: --ipfs)
  -o, --output-dir <path>            Output directory for build results (default: build/)
  -f, --output-format <format>       Output format for WASM modules (wasm, wast) (default: wasm)
  -w, --watch                        Regenerate types when web3api files change (default: false)
  -e, --test-ens <[address,]domain>  Publish the package to a test ENS domain locally
`

export default {
  alias: ["b"],
  description: "Builds a Web3API and (optionally) uploads it to IPFS",
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, parameters, print } = toolbox;

    let {
      h, help,
      i, ipfs,
      g, graph,
      o, outputDir,
      f, outputFormat,
      w, watch,
      e, testEns
    } = parameters.options;

    help = help || h;
    ipfs = ipfs || i;
    graph = graph || g;
    outputDir = outputDir || o;
    outputFormat = outputFormat || f;
    watch = watch || w;
    testEns = testEns || e;

    let manifestPath;
    try {
      const params = toolbox.parameters;
      [manifestPath] = fixParameters(
        {
          options: params.options,
          array: params.array,
        },
        {
          h,
          help,
          w,
          watch,
        }
      );
    } catch (e) {
      print.error(e.message);
      process.exitCode = 1;
      return;
    }

    if (help) {
      print.info(HELP);
      return;
    }

    if (ipfs === true) {
      print.error("--ipfs option missing <node> argument");
      print.info(HELP);
      return;
    }

    if (graph === true) {
      print.error("--graph option missing <name,node> argument");
      print.info(HELP);
      return;
    }

    if (outputDir === true) {
      print.error("--output-dir option missing <path> argument");
      print.info(HELP);
      return;
    }

    if (outputFormat === true) {
      print.error("--output-format option missing <format> argument");
      print.info(HELP);
      return;
    }

    if (graph && !ipfs) {
      print.error("--graph requires --ipfs <node>");
      print.info(HELP);
      return;
    }

    if (outputFormat && (outputFormat !== 'wasm' || outputFormat !== 'wast')) {
      print.error(`Unrecognized --output-format type: ${outputFormat}`);
      print.info(HELP);
      return;
    }

    manifestPath =
      (manifestPath && filesystem.resolve(manifestPath)) ||
      filesystem.resolve('web3api.yaml');
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) ||
      filesystem.path('build');
    outputFormat = outputFormat || 'wasm';

    const compiler = new Compiler({
      manifestPath,
      outputDir,
      outputFormat
    });

    if (watch) {
      // TODO:
      // await compiler.watchAndCompile();
    } else {
      const result = await compiler.compile();
      if (result === false) {
        process.exitCode = 1;
        return;
      }

      let uris: string[][] = []

      // publish to IPFS
      if (ipfs !== undefined) {
        const cid = await publishToIPFS(outputDir, ipfs);

        print.success(`IPFS { ${cid} }`);
        uris.push(['Web3API IPFS', `ipfs://${cid}`]);

        if (testEns) {
          let address;
          let domain;
          if (testEns.indexOf(',') > -1) {
            const [addr, dom] = testEns.split(',');
            address = addr;
            domain = dom;
          } else {
            domain = testEns;
          }

          if (!address) {
            const { data: { ethereum } } = await axios.get(
              "http://localhost:4040/providers"
            );
            const { data: { ensAddress } } = await axios.get(
              "http://localhost:4040/deploy-ens"
            );

            print.success(`ENS Registry Deployed { ${ensAddress} }`);
            uris.push(['ENS Registry', `${ethereum}/${ensAddress}`]);
          }

          // ask the dev server to publish the CID to ENS
          const { data } = await axios.get(
            "http://localhost:4040/register-ens",
            {
              params: {
                domain: domain,
                cid
              }
            }
          );

          if (data.success) {
            print.success(`ENS Resolution Configured { ${testEns} => ${cid} }`)
            uris.push(['Web3API ENS', `${testEns} => ${cid}`]);
          }
        }
      }

      // TODO: order of dependencies is strange between:
      // ipfs, graph-node, subgraph, graph-cli, and web3api.yaml
      if (graph !== undefined) {
        const [name, node] = graph.split(',');

        // TODO: remove this pathing hack
        const subgraphPath = path.join(
          path.dirname(manifestPath), 'src/subgraph/subgraph.yaml'
        );

        const id = await publishToSubgraph(subgraphPath, name, node, ipfs, outputDir);

        print.success(`Subgraph Deployed { ${id} }`);
        // TODO: remove this port hack
        uris.push(['Subgraph GraphiQL', `${node.replace('8020', '8000')}/subgraphs/id/${id}`]);
      }

      if (uris.length) {
        print.success("URI Viewers:"); 
        print.table(uris);
      }

      process.exitCode = 0;
    }
  }
}
