/* eslint-disable prefer-const */
import {
  Compiler,
  Project,
  SchemaComposer,
  Watcher,
  WatchEvent,
  watchEventName,
} from "../lib";
import { fixParameters } from "../lib/helpers/parameters";
import { publishToIPFS } from "../lib/publishers/ipfs-publisher";

import chalk from "chalk";
import axios from "axios";
import readline from "readline";
import { GluegunToolbox } from "gluegun";

const HELP = `
${chalk.bold("w3 build")} [options] ${chalk.bold("[<web3api-manifest>]")}

Options:
  -h, --help                         Show usage information
  -i, --ipfs [<node>]                Upload build results to an IPFS node (default: dev-server's node)
  -o, --output-dir <path>            Output directory for build results (default: build/)
  -e, --test-ens <[address,]domain>  Publish the package to a test ENS domain locally (requires --ipfs)
  -w, --watch                        Automatically rebuild when changes are made (default: false)
`;

export default {
  alias: ["b"],
  description: "Builds a Web3API and (optionally) uploads it to IPFS",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    const { h, i, o, w, e } = parameters.options;
    let { help, ipfs, outputDir, watch, testEns } = parameters.options;

    help = help || h;
    ipfs = ipfs || i;
    outputDir = outputDir || o;
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

    if (outputDir === true) {
      print.error("--output-dir option missing <path> argument");
      print.info(HELP);
      return;
    }

    if (testEns === true) {
      print.error("--test-ens option missing <[address,]domain> argument");
      print.info(HELP);
      return;
    }

    if (testEns && !ipfs) {
      print.error("--test-ens option requires the --ipfs [<node>] option");
      print.info(HELP);
      return;
    }

    // Resolve manifest & output directories
    manifestPath =
      (manifestPath && filesystem.resolve(manifestPath)) ||
      filesystem.resolve("web3api.yaml");
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) || filesystem.path("build");

    let ipfsProvider: string | undefined;
    let ethProvider: string | undefined;
    let ensAddress: string | undefined;
    let ensDomain: string | undefined;

    if (typeof ipfs === "string") {
      // Custom IPFS provider
      ipfsProvider = ipfs;
    } else if (ipfs) {
      // Dev-server IPFS provider
      // TODO: handle the case where the dev server isn't found
      const {
        data: { ipfs, ethereum },
      } = await axios.get("http://localhost:4040/providers");
      ipfsProvider = ipfs;
      ethProvider = ethereum;
    }

    if (typeof testEns == "string") {
      // Fetch the ENS domain, and optionally the address
      if (testEns.indexOf(",") > -1) {
        const [addr, dom] = testEns.split(",");
        ensAddress = addr;
        ensDomain = dom;
      } else {
        ensDomain = testEns;
      }

      // If not address was provided, fetch it from the server
      // or deploy a new instance
      if (!ensAddress) {
        const getEns = await axios.get("http://localhost:4040/ens");

        if (!getEns.data.ensAddress) {
          const deployEns = await axios.get("http://localhost:4040/deploy-ens");
          ensAddress = deployEns.data.ensAddress;
        } else {
          ensAddress = getEns.data.ensAddress;
        }
      }
    }

    const project = new Project({
      manifestPath,
    });

    const schemaComposer = new SchemaComposer({
      project,
      ensAddress,
      ethProvider,
      ipfsProvider,
    });

    const compiler = new Compiler({
      project,
      outputDir,
      schemaComposer,
    });

    const execute = async (): Promise<boolean> => {
      compiler.clearCache();
      const result = await compiler.compile();

      if (!result) {
        return result;
      }

      const uris: string[][] = [];

      // publish to IPFS
      if (ipfs) {
        const cid = await publishToIPFS(outputDir, ipfs);

        print.success(`IPFS { ${cid} }`);
        uris.push(["Web3API IPFS", `ipfs://${cid}`]);

        if (testEns) {
          if (!ensAddress) {
            uris.push(["ENS Registry", `${ethProvider}/${ensAddress}`]);
          }

          // ask the dev server to publish the CID to ENS
          const { data } = await axios.get(
            "http://localhost:4040/register-ens",
            {
              params: {
                domain: ensDomain,
                cid,
              },
            }
          );

          if (data.success) {
            uris.push(["Web3API ENS", `${testEns} => ${cid}`]);
          } else {
            print.error(
              `ENS Resolution Failed { ${testEns} => ${cid} }\n` +
                `Ethereum Provider: ${ethProvider}\n` +
                `ENS Address: ${ensAddress}`
            );
          }

          return data.success;
        }
      }

      if (uris.length) {
        print.success("URI Viewers:");
        print.table(uris);
        return true;
      } else {
        return false;
      }
    };

    if (!watch) {
      const result = await execute();

      if (!result) {
        process.exitCode = 1;
        return;
      }
    } else {
      // Execute
      await execute();

      const keyPressListener = () => {
        // Watch for escape key presses
        print.info(`Watching: ${project.manifestDir}`);
        print.info("Exit: [CTRL + C], [ESC], or [Q]");
        readline.emitKeypressEvents(process.stdin);
        process.stdin.on("keypress", async (str, key) => {
          if (
            key.name == "escape" ||
            key.name == "q" ||
            (key.name == "c" && key.ctrl)
          ) {
            await watcher.stop();
            process.kill(process.pid, "SIGINT");
          }
        });

        if (process.stdin.setRawMode) {
          process.stdin.setRawMode(true);
        }

        process.stdin.resume();
      };

      keyPressListener();

      // Watch the directory
      const watcher = new Watcher();

      watcher.start(project.manifestDir, {
        ignored: [outputDir + "/**", project.manifestDir + "/**/w3/**"],
        ignoreInitial: true,
        execute: async (events: WatchEvent[]) => {
          // Log all of the events encountered
          for (const event of events) {
            print.info(`${watchEventName(event.type)}: ${event.path}`);
          }

          // Execute the build
          await execute();

          // Process key presses
          keyPressListener();
        },
      });
    }

    process.exitCode = 0;
  },
};
