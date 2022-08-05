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

type ManifestSequence = DeployManifest["sequences"][number];
type ManifestStep = ManifestSequence["steps"][number];

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

  const allStepsFromAllSequences = deployManifest.sequences.flatMap(
    (sequence) => {
      return sequence.steps.map((step) => ({
        sequenceName: sequence.name,
        ...step,
      }));
    }
  );

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

  const sequences = deployManifest.sequences.map((sequence) => {
    const steps = sequence.steps.map((step) => {
      return new Step({
        name: step.name,
        uriOrStepResult: step.uri,
        deployer: stepToPackageMap[step.name].deployer,
        config: step.config ?? {},
      });
    });

    return new Sequence({
      name: sequence.name,
      steps,
      config: sequence.config ?? {},
      printer: print,
    });
  });

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
  const errors = Object.entries(stepToPackageMap).flatMap(
    ([stepName, step]) => {
      const sequence = deployManifest.sequences.find(
        (seq) => seq.name === step.sequenceName
      ) as ManifestSequence;

      const stepToValidate = sequence.steps.find(
        (s) => s.name === stepName
      ) as ManifestStep;

      return step.manifestExt
        ? validate(
            {
              ...sequence.config,
              ...stepToValidate.config,
            },
            step.manifestExt
          ).errors
        : [];
    }
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
