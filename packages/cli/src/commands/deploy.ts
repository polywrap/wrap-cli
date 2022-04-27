/* eslint-disable prefer-const */
import {
  intlMsg,
  Web3ApiProject,
  defaultWeb3ApiManifest,
  resolvePathIfExists,
  DeployPackage,
} from "../lib";
import { DeployerHandler } from "../lib/deploy/deployer";

import chalk from "chalk";
import fs from "fs";
import nodePath from "path";
import { GluegunToolbox, GluegunPrint } from "gluegun";
import { Uri, DeployManifest } from "@web3api/core-js";
import { validate } from "jsonschema";

const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");
const optionsStr = intlMsg.commands_deploy_options_options();
const pathStr = intlMsg.commands_deploy_options_o_path();

const HELP = `
${chalk.bold("w3 deploy")} [${optionsStr}]

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                         ${intlMsg.commands_deploy_options_h()}
  -m, --manifest-file <${pathStr}>         ${intlMsg.commands_deploy_options_m({
  default: defaultManifestStr,
})}
  -v, --verbose                      ${intlMsg.commands_deploy_options_v()}`;

export default {
  alias: ["b"],
  description: intlMsg.commands_deploy_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    const { h, m, v } = parameters.options;
    let { help, manifestFile, verbose } = parameters.options;

    help = help || h;
    verbose = verbose || v;
    manifestFile = manifestFile || m;

    // Validate Params
    const paramsValid = validateDeployParams(print, {
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
      throw new Error("No deploy manifest found.");
    }

    const packageNames = [
      ...new Set(Object.values(deployManifest.stages).map((d) => d.package)),
    ];

    sanitizePackages(packageNames);

    await project.cacheDeploymentPackages(packageNames);

    const packageMap: Record<string, DeployPackage> = {};
    const stageToPackageMap: Record<string, DeployPackage> = {};

    for await (const packageName of packageNames) {
      packageMap[packageName] = await project.getDeploymentPackage(packageName);
    }

    Object.entries(deployManifest.stages).forEach(([stageName, stageValue]) => {
      stageToPackageMap[stageName] = packageMap[stageValue.package];
    });

    validateManifestWithExts(deployManifest, stageToPackageMap);

    const handlers: Record<string, DeployerHandler> = {};
    const roots: { handler: DeployerHandler; uri: Uri }[] = [];

    // Create all handlers
    Object.entries(deployManifest.stages).forEach(([stageName, stageValue]) => {
      const publisher = stageToPackageMap[stageName].deployer;
      const handler = new DeployerHandler(
        stageName,
        publisher,
        stageValue.config,
        print
      );

      handlers[stageName] = handler;
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

    for await (const root of roots) {
      print.info(`\nExecuting deployment chain: \n`);
      root.handler.getDependencyTree().printTree();
      print.info("");
      await root.handler.handle(root.uri);
    }

    process.exitCode = 0;
  },
};

function validateDeployParams(
  print: GluegunPrint,
  params: {
    manifestFile: unknown;
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

function validateManifestWithExts(
  deployManifest: DeployManifest,
  stageToPackageMap: Record<string, DeployPackage>
) {
  const errors = Object.entries(
    stageToPackageMap
  ).flatMap(([stageName, deployPackage]) =>
    deployPackage.manifestExt
      ? validate(
          deployManifest.stages[stageName].config,
          deployPackage.manifestExt
        ).errors
      : []
  );

  if (errors.length) {
    throw new Error(
      [
        `Validation errors encountered while sanitizing DeployManifest format ${deployManifest.format}`,
        ...errors.map((error) => error.toString()),
      ].join("\n")
    );
  }
}
