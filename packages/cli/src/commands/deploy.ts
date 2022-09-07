/* eslint-disable prefer-const */
import { Command, Program } from "./types";
import {
  defaultPolywrapManifest,
  DeployerHandler,
  DeployPackage,
  intlMsg,
  parseManifestFileOption,
  PolywrapProject,
  ResultList,
} from "../lib";

import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";
import nodePath from "path";
import { print } from "gluegun";
import yaml from "js-yaml";
import { Uri } from "@polywrap/core-js";
import { validate } from "jsonschema";

const defaultManifestStr = defaultPolywrapManifest.join(" | ");
const pathStr = intlMsg.commands_deploy_options_o_path();

type DeployCommandOptions = {
  manifestFile: string;
  outputFile?: string;
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
      .option(
        `-o, --output-file <${pathStr}>`,
        `${intlMsg.commands_deploy_options_o()}`
      )
      .option(`-v, --verbose`, `${intlMsg.commands_deploy_options_v()}`)
      .action(async (options) => {
        await run({
          ...options,
          manifestFile: parseManifestFileOption(options.manifestFile, defaultPolywrapManifest),
        });
      });
  },
};

async function run(options: DeployCommandOptions): Promise<void> {
  const { manifestFile, verbose, outputFile } = options;

  const project = new PolywrapProject({
    rootDir: nodePath.dirname(manifestFile),
    polywrapManifestPath: manifestFile,
    quiet: !verbose,
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
    handlers[stageName] = new DeployerHandler(
      stageName,
      publisher,
      stageValue.config,
      print
    );
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

  const resultLists: ResultList[] = [];

  for await (const root of roots) {
    print.info(`\nExecuting deployment chain: \n`);
    root.handler.getDependencyTree().printTree();
    print.info("");
    await root.handler.handle(root.uri);
    resultLists.push(root.handler.getResultsList());
  }

  const getResults = (
    resultList: ResultList,
    prefix?: string
  ): {
    name: string;
    input: unknown;
    result: string;
    id: string;
  }[] => {
    const id = prefix ? `${prefix}.${resultList.name}` : resultList.name;

    return [
      {
        id,
        name: resultList.name,
        input: resultList.input,
        result: resultList.result,
      },
      ...resultList.children.flatMap((r) => getResults(r, id)),
    ];
  };

  if (outputFile) {
    const resultOutput = resultLists.flatMap((r) => getResults(r));

    const outputFileExt = nodePath.extname(outputFile).substring(1);
    if (!outputFileExt) throw new Error("Require output file extension");
    switch (outputFileExt) {
      case "yaml":
      case "yml":
        fs.writeFileSync(outputFile, yaml.dump(resultOutput));
        break;
      case "json":
        fs.writeFileSync(outputFile, JSON.stringify(resultOutput, null, 2));
        break;
      default:
        throw new Error(
          intlMsg.commands_run_error_unsupportedOutputFileExt({ outputFileExt })
        );
    }
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
