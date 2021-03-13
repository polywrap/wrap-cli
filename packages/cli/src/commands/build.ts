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
import { getIntl } from "../lib/internationalization";

import { defineMessages } from "@formatjs/intl";
import chalk from "chalk";
import axios from "axios";
import readline from "readline";
import { GluegunToolbox } from "gluegun";

const intl = getIntl();

const helpMessages = defineMessages({
  h: {
    id: "commands_build_options_h",
    defaultMessage: "Show usage information",
    description: "",
  },
  i: {
    id: "commands_build_options_i",
    defaultMessage: "Upload build results to an IPFS node (default: dev-server's node)",
    description: "",
  },
  o: {
    id: "commands_build_options_o",
    defaultMessage: "Output directory for build results (default: build/)",
    description: "",
  },
  e: {
    id: "commands_build_options_e",
    defaultMessage: "Publish the package to a test ENS domain locally (requires --ipfs)",
    description: "",
  },
  w: {
    id: "commands_build_options_w",
    defaultMessage: "Automatically rebuild when changes are made (default: false)",
    description: "",
  },
  options: {
    id: "commands_build_options_options",
    defaultMessage: "options",
  },
  node: {
    id: "commands_build_options_i_node",
    defaultMessage: "node",
    description: "IPFS node",
  },
  path: {
    id: "commands_build_options_o_path",
    defaultMessage: "path",
    description: "file path for output",
  },
  address: {
    id: "commands_build_options_e_address",
    defaultMessage: "address",
    description: "Ethereum address",
  },
  domain: {
    id: "commands_build_options_e_domain",
    defaultMessage: "domain",
    description: "ENS domain (e.g. https://name.eth)",
  },
});
const optionsString = intl.formatMessage(helpMessages.options);
const nodeString = `[<${intl.formatMessage(helpMessages.node)}>]`;
const outputDirString = `<${intl.formatMessage(helpMessages.path)}>`;
const addressDomainString = `<[${intl.formatMessage(helpMessages.address)},]${intl.formatMessage(helpMessages.domain)}>`;
const HELP = `
${chalk.bold("w3 build")} [${optionsString}] ${chalk.bold("[<web3api-manifest>]")}

${optionsString[0].toUpperCase() + optionsString.slice(1)}:
  -h, --help                         ${intl.formatMessage(helpMessages.h)}
  -i, --ipfs ${nodeString}                ${intl.formatMessage(helpMessages.i)}
  -o, --output-dir ${outputDirString}            ${intl.formatMessage(helpMessages.o)}
  -e, --test-ens ${addressDomainString}  ${intl.formatMessage(helpMessages.e)}
  -w, --watch                        ${intl.formatMessage(helpMessages.w)}
`;

export default {
  alias: ["b"],
  description: intl.formatMessage({
    id: "commands_build_description",
    defaultMessage: "Builds a Web3API and (optionally) uploads it to IPFS",
    description: "description of command 'w3 build'",
  }),
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
      const outputDirMissingPathMessage = intl.formatMessage(
        {
          id: "commands_build_error_outputDirMissingPath",
          defaultMessage: "{optionName} option missing {argument} argument",
          description: "",
        },
        {
          optionName: "--output-dir",
          argument: outputDirString,
        }
      );
      print.error(outputDirMissingPathMessage);
      print.info(HELP);
      return;
    }

    if (testEns === true) {
      const testEnsAddressMissingMessage = intl.formatMessage(
        {
          id: "commands_build_error_testEnsAddressMissing",
          defaultMessage: "{optionName} option missing {argument} argument",
          description: "",
        },
        {
          optionName: "--test-ens",
          argument: addressDomainString,
        }
      );
      print.error(testEnsAddressMissingMessage);
      print.info(HELP);
      return;
    }

    if (testEns && !ipfs) {
      const testEnsNodeMissingMessage = intl.formatMessage(
        {
          id: "commands_build_error_testEnsNodeMissing",
          defaultMessage:
            "{optionName} option requires the {requiredOptionName} option",
          description: "",
        },
        {
          optionName: "--test-ens",
          requiredOptionName: `--ipfs ${nodeString}`,
        }
      );
      print.error(testEnsNodeMissingMessage);
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
            const ensRegistryMessage = intl.formatMessage({
              id: "commands_build_ensRegistry",
              defaultMessage: "ENS Registry",
              description: "",
            });
            uris.push([ensRegistryMessage, `${ethProvider}/${ensAddress}`]);
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
            const resolutionErrorMessages = defineMessages({
              resolution: {
                id: "commands_build_error_resolution",
                defaultMessage: "ENS Resolution Failed",
                description: "",
              },
              provider: {
                id: "commands_build_ethProvider",
                defaultMessage: "Ethereum Provider",
                description: "",
              },
              address: {
                id: "commands_build_address",
                defaultMessage: "ENS Address",
                description: "",
              },
            });
            print.error(
              `${intl.formatMessage(resolutionErrorMessages.resolution)} { ${testEns} => ${cid} }\n` +
                `${intl.formatMessage(resolutionErrorMessages.provider)}: ${ethProvider}\n` +
                `${intl.formatMessage(resolutionErrorMessages.address)}: ${ensAddress}`
            );
          }

          return data.success;
        }
      }

      if (uris.length) {
        const uriViewers = intl.formatMessage({
          id: "commands_build_uriViewers",
          defaultMessage: "URI Viewers",
          description: "",
        });
        print.success(`${uriViewers}:`);
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
        const keypressListenerMessages = defineMessages({
          watching: {
            id: "commands_build_keypressListener_watching",
            defaultMessage: "Watching",
            description: "watching, monitoring key presses",
          },
          exit: {
            id: "commands_build_keypressListener_exit",
            defaultMessage: "Exit: [CTRL + C], [ESC], or [Q]",
            description: "Stop watching, monitoring key presses",
          },
        });
        print.info(`${intl.formatMessage(keypressListenerMessages.watching)}: ${project.manifestDir}`);
        print.info(intl.formatMessage(keypressListenerMessages.exit));
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
