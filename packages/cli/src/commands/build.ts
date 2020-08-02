import { Compiler } from "../lib/compiler";
import { fixParameters } from "../lib/helpers/parameters";
import { GluegunToolbox } from "gluegun";
import chalk from "chalk";

const HELP = `
${chalk.bold('w3 build')} [options] ${chalk.bold('[<web3api-manifest>]')}

Options:
  -h, --help                    Show usage information
  -i, --ipfs <node>             Upload build results to an IPFS node
  -o, --output-dir <path>       Output directory for build results (default: build/)
  -t, --output-format <format>  Output format for WASM modules (wasm, wast) (default: wasm)
  -w, --watch                   Regenerate types when web3api files change (default: false)
`

export default {
  alias: ["b"],
  description: "Builds a web3api and (optionally) uploads it to IPFS",
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, parameters, print } = toolbox;

    let {
      i, ipfs,
      h, help,
      o, outputDir,
      t, outputFormat,
      w, watch
    } = parameters.options;

    ipfs = ipfs || i;
    help = help || h;
    outputDir = outputDir || o;
    outputFormat = outputFormat || t;
    watch = watch || w;

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

    if (outputFormat !== 'wasm' || outputFormat !== 'wast') {
      print.error(`Unrecognized --output-format type: ${outputFormat}`);
      print.info(HELP);
      return;
    }

    manifestPath = manifestPath || filesystem.resolve('web3api.yaml');
    outputDir = outputDir || filesystem.path('build');
    outputFormat = outputFormat || 'wasm';

    const compiler = new Compiler({
      manifestPath,
      ipfs: ipfs ? ipfs : undefined,
      outputDir,
      outputFormat
    });

    if (watch) {
      await compiler.watchAndCompile();
    } else {
      const result = await compiler.compile();
      if (result === false) {
        process.exitCode = 1;
      }
    }
  }
}
