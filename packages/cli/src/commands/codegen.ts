/* eslint-disable prefer-const */
import { fixParameters } from "../lib/helpers/parameters";
import { CodeGenerator } from "../lib/generators/CodeGenerator";

import chalk from "chalk";
import axios from "axios";
import { GluegunToolbox } from "gluegun";

const defaultTemplate = "web3api.gen";
const defaultManifest = "web3api.yaml";

const HELP = `
${chalk.bold("w3 codegen")} ${chalk.bold("[<template-file>]")} [options]

Template file:
  Path to input template file (default: ${defaultTemplate})

Options:
  -h, --help                              Show usage information
  -m, --manifest-path <path>              Path to the Web3API manifest file (default: ${defaultManifest})
  -i, --ipfs [<node>]                     IPFS node to load external schemas (default: dev-server's node)
  -o, --output-dir <path>                 Output directory for generated types (default: types/)
  -e, --ens [<address>]                   ENS address
`;

export default {
  alias: ["g"],
  description: "Auto-generate API Types",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    const { h, m, i, o, e } = parameters.options;
    let { help, manifestPath, ipfs, outputDir, ens } = parameters.options;

    help = help || h;
    manifestPath = manifestPath || m;
    ipfs = ipfs || i;
    outputDir = outputDir || o;
    ens = ens || e;

    let templateFile;
    try {
      const params = toolbox.parameters;
      [templateFile] = fixParameters(
        {
          options: params.options,
          array: params.array,
        },
        {
          h,
          help,
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

    if (ens === true) {
      print.error("--ens option missing <[address,]domain> argument");
      print.info(HELP);
      return;
    }

    let ipfsProvider: string | undefined;
    let ethProvider: string | undefined;
    let ensAddress: string | undefined = ens;

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

    // Resolve template file & output directories
    templateFile =
      (templateFile && filesystem.resolve(templateFile)) ||
      filesystem.resolve(defaultTemplate);
    manifestPath =
      (manifestPath && filesystem.resolve(manifestPath)) ||
      filesystem.resolve(defaultManifest);
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) || filesystem.path("types");

    const codeGenerator = new CodeGenerator(templateFile, {
      manifestPath,
      ipfsProvider,
      ethProvider,
      ensAddress,
      outputDir,
    });

    await codeGenerator.generateCode();
  },
};
