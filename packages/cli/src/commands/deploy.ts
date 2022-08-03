/* eslint-disable prefer-const */
import { Command, Program } from "./types";
import {
  defaultPolywrapManifest,
  DeployPackage,
  intlMsg,
  parseWasmManifestFileOption,
  PolywrapProject,
  Sequence,
  SequenceResult,
  Step,
} from "../lib";

import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";
import nodePath from "path";
import { print } from "gluegun";
import yaml from "js-yaml";
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
          manifestFile: parseWasmManifestFileOption(options.manifestFile),
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

  const allStepsFromAllSequences = Object.entries(
    deployManifest.sequences
  ).flatMap(([sequenceName, sequence]) => {
    return Object.entries(sequence.steps).map(([stepName, step]) => {
      return {
        sequenceName,
        name: stepName,
        ...step,
      };
    });
  });

  const packageNames = [
    ...new Set(allStepsFromAllSequences.map((step) => step.package)),
  ];

  sanitizePackages(packageNames);

  await project.cacheDeployModules(packageNames);

  const packageMap: Record<string, DeployPackage> = {};

  for await (const packageName of packageNames) {
    packageMap[packageName] = await project.getDeployModule(packageName);
  }

  const stepToPackageMap: Record<
    string,
    DeployPackage & { sequenceName: string }
  > = {};

  for (const step of allStepsFromAllSequences) {
    stepToPackageMap[step.name] = {
      ...packageMap[step.package],
      sequenceName: step.sequenceName,
    };
  }

  validateManifestWithExts(deployManifest, stepToPackageMap);

  const sequences = Object.entries(deployManifest.sequences).map(
    ([sequenceName, sequenceValue]) => {
      const steps = Object.entries(sequenceValue.steps).map(
        ([stepName, stepValue]) => {
          return new Step({
            name: stepName,
            uriOrStepResult: stepValue.uri,
            deployer: stepToPackageMap[stepName].deployer,
            config: stepValue.config ?? {},
          });
        }
      );

      return new Sequence({
        name: sequenceName,
        steps,
        config: sequenceValue.config ?? {},
        printer: print,
      });
    }
  );

  const sequenceResults: SequenceResult[] = [];

  for await (const sequence of sequences) {
    const sequenceResult = await sequence.run();
    sequenceResults.push(sequenceResult);
  }

  if (outputFile) {
    const outputFileExt = nodePath.extname(outputFile).substring(1);
    if (!outputFileExt) throw new Error("Require output file extension");
    switch (outputFileExt) {
      case "yaml":
      case "yml":
        fs.writeFileSync(outputFile, yaml.dump(sequenceResults));
        break;
      case "json":
        fs.writeFileSync(outputFile, JSON.stringify(sequenceResults, null, 2));
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
  stepToPackageMap: Record<string, DeployPackage & { sequenceName: string }>
) {
  const errors = Object.entries(stepToPackageMap).flatMap(([stepName, step]) =>
    step.manifestExt
      ? validate(
          deployManifest.sequences[step.sequenceName].steps[stepName].config,
          step.manifestExt
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
