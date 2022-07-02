/* eslint-disable prefer-const */
import { Command, Program } from "./types";
import {
  intlMsg,
  PolywrapProject,
  defaultPolywrapManifest,
  DeployPackage,
  DeployerHandler,
  parseWasmManifestFileOption,
} from "../lib";

import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";
import nodePath from "path";
import { print } from "gluegun";
import { Uri } from "@polywrap/core-js";
import { validate } from "jsonschema";

const defaultManifestStr = defaultPolywrapManifest.join(" | ");
const pathStr = intlMsg.commands_deploy_options_o_path();

type DeployCommandOptions = {
  manifestFile: string;
  verbose?: boolean;
};

export const deploy: Command = {
  setup: (program: Program) => {
    program
      .command("deploy")
      .alias("d")
      .description(intlMsg.commands_deploy_description())
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_deploy_options_m({
          default: defaultManifestStr,
        })}`
      )
      .option(`-v, --verbose`, `${intlMsg.commands_deploy_options_v()}`)
      .action(async (options) => {
        await run({
          ...options,
          manifestFile: parseWasmManifestFileOption(
            options.manifestFile,
            undefined
          ),
        });
      });
  },
};

async function run(options: DeployCommandOptions): Promise<void> {
  const { manifestFile, verbose } = options;

  const project = new PolywrapProject({
    rootDir: nodePath.dirname(manifestFile),
    polywrapManifestPath: manifestFile,
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

  await project.cacheDeployModules(packageNames);

  const packageMap: Record<string, DeployPackage> = {};
  const stageToPackageMap: Record<string, DeployPackage> = {};

  for await (const packageName of packageNames) {
    packageMap[packageName] = await project.getDeployModule(packageName);
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

  return;
}

function sanitizePackages(packages: string[]) {
  const unrecognizedPackages: string[] = [];

  const availableDeployers = fs.readdirSync(
    nodePath.join(__dirname, "..", "lib", "defaults", "deploy-modules")
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
