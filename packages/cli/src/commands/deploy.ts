/* eslint-disable prefer-const */
import {
  intlMsg,
  Web3ApiProject,
  defaultWeb3ApiManifest,
  resolvePathIfExists,
} from "../lib";
import { DeployerHandler } from "../lib/deploy/deployer";

import chalk from "chalk";
import fs from "fs";
import nodePath from "path";
import { GluegunToolbox, GluegunPrint } from "gluegun";
import { Uri } from "@web3api/core-js";

const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");
const optionsStr = intlMsg.commands_deploy_options_options();
const pathStr = intlMsg.commands_deploy_options_o_path();

const HELP = `
${chalk.bold("w3 deploy")} [${optionsStr}]

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                         ${intlMsg.commands_deploy_options_h()}
  -m, --manifest-file <${pathStr}>   ${intlMsg.commands_deploy_options_m({
  default: defaultManifestStr,
})}
  -v, --verbose                      ${intlMsg.commands_deploy_options_v()}
`;

export default {
  alias: ["b"],
  description: intlMsg.commands_build_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    const { h, m, v, n, c } = parameters.options;
    let { help, manifestFile, verbose, name, cid } = parameters.options;

    help = help || h;
    verbose = verbose || v;
    manifestFile = manifestFile || m;
    name = name || n;
    cid = cid || c;

    // Validate Params
    const paramsValid = validateDeployParams(print, {
      name,
      cid,
      manifestFile,
    });

    if (help || !paramsValid) {
      print.info(HELP);
      if (!paramsValid) {
        process.exitCode = 1;
      }
      return;
    }

    // Resolve manifest & output directory
    const manifestPaths = manifestFile
      ? [manifestFile as string]
      : defaultWeb3ApiManifest;
    manifestFile = resolvePathIfExists(filesystem, manifestPaths);

    if (!manifestFile) {
      print.error(
        intlMsg.commands_build_error_manifestNotFound({
          paths: manifestPaths.join(", "),
        })
      );
      return;
    }

    const project = new Web3ApiProject({
      rootCacheDir: nodePath.dirname(manifestFile),
      web3apiManifestPath: manifestFile,
      quiet: verbose ? false : true,
    });

    await project.validate();

    const deployManifest = await project.getDeployManifest();

    if (!deployManifest) {
      throw new Error("No deploy manifest");
    }

    const packages = Object.values(deployManifest.stages).map((d) => d.package);

    sanitizePackages(packages);

    await project.cacheDeploymentPackages(packages);

    const handlers: Record<string, DeployerHandler> = {};
    const roots: { handler: DeployerHandler; uri: Uri }[] = [];

    // Create all handlers
    Object.entries(deployManifest.stages).forEach(([key, value]) => {
      const publisher = project.getDeploymentPackage(value.package);
      const handler = new DeployerHandler(key, publisher, value.config);

      handlers[key] = handler;
    });

    // Establish dependency chains
    Object.entries(deployManifest.stages).forEach(([key, value]) => {
      const thisHandler = handlers[key];

      if (value.depends_on) {
        // Depends on another stage
        handlers[value.depends_on].addNext(thisHandler);
      } else if (value.uri) {
        // It is a root node
        roots.push({ uri: new Uri(value.uri), handler: thisHandler });
      } else {
        throw new Error(
          `Stage '${key}' needs either previous (depends_on) stage or URI`
        );
      }
    });

    // Execute roots

    roots.forEach((root) => {
      console.log(root.handler.getList());
    });

    const uris: Uri[][] = [];

    for await (const root of roots) {
      uris.push(await root.handler.handle(root.uri));
    }

    roots.forEach((root) => {
      console.log(root.handler.getResultsList());
    });

    console.log(uris.map((uArray) => uArray.map((u) => u.toString())));

    process.exitCode = 0;
  },
};

function validateDeployParams(
  print: GluegunPrint,
  params: {
    manifestFile: unknown;
    name: unknown;
    cid: unknown;
  }
): boolean {
  const { manifestFile } = params;

  if (manifestFile === true) {
    const manifestPathMissingMessage = intlMsg.commands_build_error_manifestPathMissing(
      {
        option: "--manifest-file",
        argument: `<${pathStr}>`,
      }
    );
    print.error(manifestPathMissingMessage);
    return false;
  }

  return true;
}

function sanitizePackages(packages: string[]) {
  const unrecognizedPackages: string[] = [];

  const availableDeployers = fs.readdirSync(
    nodePath.join(__dirname, "..", "lib", "deployers")
  );

  packages.forEach((p) => {
    if (!availableDeployers.includes(p)) {
      unrecognizedPackages.push(p);
    }
  });

  if (unrecognizedPackages.length) {
    throw new Error(
      `Unrecognized packages: ${unrecognizedPackages.join(", ")}`
    );
  }
}
