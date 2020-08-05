import { Compiler } from "../lib/Compiler";
import { Publisher } from "../lib/Publisher";
import { fixParameters } from "../lib/helpers/parameters";

import { GluegunToolbox } from "gluegun";
import chalk from "chalk";
import axios from "axios";

const HELP = `
${chalk.bold('w3 build')} [options] ${chalk.bold('[<web3api-manifest>]')}

Options:
  -h, --help                    Show usage information
  -i, --ipfs <node>             Upload build results to an IPFS node
  -o, --output-dir <path>       Output directory for build results (default: build/)
  -f, --output-format <format>  Output format for WASM modules (wasm, wast) (default: wasm)
  -w, --watch                   Regenerate types when web3api files change (default: false)
  -e, --test-ens <domain>       Publish the package to a test ENS domain locally
`

export default {
  alias: ["b"],
  description: "Builds a Web3API and (optionally) uploads it to IPFS",
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, parameters, print } = toolbox;

    let {
      i, ipfs,
      h, help,
      o, outputDir,
      f, outputFormat,
      w, watch,
      e, testEns
    } = parameters.options;

    ipfs = ipfs || i;
    help = help || h;
    outputDir = outputDir || o;
    outputFormat = outputFormat || f;
    watch = watch || w;
    testEns = testEns || e;

    let manifestPath;
    try {
      ;[manifestPath] = fixParameters(toolbox.parameters, {
        h,
        help,
        w,
        watch,
      });
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

    if (outputFormat && (outputFormat !== 'wasm' || outputFormat !== 'wast')) {
      print.error(`Unrecognized --output-format type: ${outputFormat}`);
      print.info(HELP);
      return;
    }

    manifestPath = manifestPath || filesystem.resolve('web3api.yaml');
    outputDir = outputDir || filesystem.path('build');
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

      // publish to IPFS
      if (ipfs !== undefined) {
        const publisher = new Publisher({
          buildPath: outputDir,
          ipfs
        });

        const cid = await publisher.publishToIPFS();
        console.log(`IPFS { ${cid} }`);

        if (testEns) {
          // ask the dev server to publish the CID to ENS
          const { data } = await axios.get(
            "http://localhost:4040/register-ens",
            {
              params: {
                domain: testEns,
                cid
              }
            }
          );

          console.log("HERERERERE")
          console.log(data.success)
        }
      }

      process.exitCode = 0;
    }
  }
}
