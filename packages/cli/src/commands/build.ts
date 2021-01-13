import { Compiler } from "../lib/Compiler";
import { fixParameters } from "../lib/helpers/parameters";
import { publishToIPFS } from "../lib/publishers/ipfs-publisher";

import chalk from "chalk";
import axios from "axios";
import { GluegunToolbox } from "gluegun";

const HELP = `
${chalk.bold("w3 build")} [options] ${chalk.bold("[<web3api-manifest>]")}

Options:
  -h, --help                         Show usage information
  -i, --ipfs <node>                  Upload build results to an IPFS node
  -o, --output-dir <path>            Output directory for build results (default: build/)
  -f, --output-format <format>       Output format for WASM modules (wasm, wast) (default: wasm)
  -w, --watch                        Regenerate types when web3api files change (default: false)
  -e, --test-ens <[address,]domain>  Publish the package to a test ENS domain locally
`;

export default {
  alias: ["b"],
  description: "Builds a Web3API and (optionally) uploads it to IPFS",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    const { h, i, g, o, f, w, e } = parameters.options;
    let {
      help,
      ipfs,
      outputDir,
      outputFormat,
      watch,
      testEns,
    } = parameters.options;

    help = help || h;
    ipfs = ipfs || i;
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

    if (outputFormat && (outputFormat !== "wasm" || outputFormat !== "wast")) {
      print.error(`Unrecognized --output-format type: ${outputFormat}`);
      print.info(HELP);
      return;
    }

    manifestPath =
      (manifestPath && filesystem.resolve(manifestPath)) ||
      filesystem.resolve("web3api.yaml");
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) || filesystem.path("build");
    outputFormat = outputFormat || "wasm";

    const compiler = new Compiler({
      manifestPath,
      outputDir,
      outputFormat,
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

      const uris: string[][] = [];

      // publish to IPFS
      if (ipfs !== undefined) {
        const cid = await publishToIPFS(outputDir, ipfs);

        print.success(`IPFS { ${cid} }`);
        uris.push(["Web3API IPFS", `ipfs://${cid}`]);

        if (testEns) {
          let address;
          let domain;
          if (testEns.indexOf(",") > -1) {
            const [addr, dom] = testEns.split(",");
            address = addr;
            domain = dom;
          } else {
            address = null;
            domain = testEns;
          }

          if (!address) {
            const {
              data: { ethereum },
            } = await axios.get("http://localhost:4040/providers");
            const {
              data: { ensAddress },
            } = await axios.get("http://localhost:4040/deploy-ens");

            print.success(`ENS Registry Deployed { ${ensAddress} }`);
            uris.push(["ENS Registry", `${ethereum}/${ensAddress}`]);
          }

          // ask the dev server to publish the CID to ENS
          const { data } = await axios.get(
            "http://localhost:4040/register-ens",
            {
              params: {
                domain: domain,
                cid,
              },
            }
          );

          if (data.success) {
            print.success(`ENS Resolution Configured { ${testEns} => ${cid} }`);
            uris.push(["Web3API ENS", `${testEns} => ${cid}`]);
          }
        }
      }

      if (uris.length) {
        print.success("URI Viewers:");
        print.table(uris);
      }

      process.exitCode = 0;
    }
  },
};
