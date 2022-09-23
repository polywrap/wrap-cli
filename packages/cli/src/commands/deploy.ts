/* eslint-disable prefer-const */
import { Command, Program } from "./types";
import {
  defaultPolywrapManifest,
  DeployPackage,
  intlMsg,
  parseManifestFileOption,
  PolywrapProject,
  DeployJob,
  DeployStep,
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

type ManifestJob = DeployManifest["jobs"][number];
type ManifestStep = ManifestJob["steps"][number];

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
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultPolywrapManifest
          ),
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

  const allStepsFromAllJobs = Object.entries(deployManifest.jobs).flatMap(
    ([jobName, job]) => {
      return job.steps.map((step) => ({
        jobName,
        ...step,
      }));
    }
  );

  const packageNames = [
    ...new Set(allStepsFromAllJobs.map((step) => step.package)),
  ];

  sanitizePackages(packageNames);

  await project.cacheDeployModules(packageNames);

  const packageMapEntries = await Promise.all(
    packageNames.map(async (packageName) => {
      const deployerPackage = await project.getDeployModule(packageName);
      return [packageName, deployerPackage];
    })
  );

  const packageMap = Object.fromEntries(packageMapEntries);

  const stepToPackageMap: Record<
    string,
    DeployPackage & { jobName: string }
  > = {};

  for (const step of allStepsFromAllJobs) {
    stepToPackageMap[step.name] = {
      ...packageMap[step.package],
      jobName: step.jobName,
    };
  }

  validateManifestWithExts(deployManifest, stepToPackageMap);

  const jobs = Object.entries(deployManifest.jobs).map(([jobName, job]) => {
    const steps: DeployStep[] = job.steps.map((step) => {
      return new DeployStep({
        name: step.name,
        uriOrStepResult: step.uri,
        deployer: stepToPackageMap[step.name].deployer,
        config: step.config ?? {},
      });
    });

    return new DeployJob({
      name: jobName,
      steps,
      config: job.config ?? {},
      printer: print,
    });
  });

  const jobResults = await Promise.all(jobs.map((job) => job.run()));

  if (outputFile) {
    const outputFileExt = nodePath.extname(outputFile).substring(1);
    if (!outputFileExt) throw new Error("Require output file extension");
    switch (outputFileExt) {
      case "yaml":
      case "yml":
        fs.writeFileSync(outputFile, yaml.dump(jobResults));
        break;
      case "json":
        fs.writeFileSync(outputFile, JSON.stringify(jobResults, null, 2));
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
  stepToPackageMap: Record<string, DeployPackage & { jobName: string }>
) {
  const errors = Object.entries(stepToPackageMap).flatMap(
    ([stepName, step]) => {
      const jobEntry = Object.entries(deployManifest.jobs).find(
        ([jobName]) => jobName === step.jobName
      ) as [string, ManifestJob];

      const job = jobEntry[1];

      const stepToValidate = job.steps.find(
        (s) => s.name === stepName
      ) as ManifestStep;

      return step.manifestExt
        ? validate(
            {
              ...job.config,
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
