import { Command, Program } from "./types";
import {
  intlMsg,
  JobResult,
  JobRunner,
  JobStatus,
  loadValidationScript,
  loadWorkflowManifest,
  parseClientConfigOption,
  parseWorkflowOutputFilePathOption,
  printJobOutput,
  validateJobNames,
  validateOutput,
  ValidationResult,
  WorkflowOutput,
  defaultWorkflowManifest,
  parseManifestFileOption,
} from "../lib";

import { Uri } from "@polywrap/client-js";
import path from "path";
import yaml from "js-yaml";
import fs from "fs";
import { CustomClientConfig } from "@polywrap/client-config-builder-js";

type WorkflowCommandOptions = {
  clientConfig: Partial<CustomClientConfig<Uri | string>>;
  manifest: string;
  jobs?: string[];
  validationScript?: string;
  outputFile?: string;
  quiet?: boolean;
};

const defaultManifestStr = defaultWorkflowManifest.join(" | ");
const pathStr = intlMsg.commands_run_options_m_path();

export const run: Command = {
  setup: (program: Program) => {
    program
      .command("run")
      .alias("r")
      .description(intlMsg.commands_run_description())
      .option(
        `-m, --manifest-file  <${pathStr}>`,
        intlMsg.commands_run_options_m({
          default: defaultManifestStr,
        })
      )
      .option(
        `-c, --client-config <${intlMsg.commands_common_options_configPath()}>`,
        `${intlMsg.commands_common_options_config()}`
      )
      .option(
        `-o, --output-file <${intlMsg.commands_run_options_outputFilePath()}>`,
        `${intlMsg.commands_run_options_outputFile()}`
      )
      .option(
        `-j, --jobs <${intlMsg.commands_run_options_jobIds()}...>`,
        intlMsg.commands_run_options_jobs()
      )
      .option(`-q, --quiet`, `${intlMsg.commands_run_options_quiet()}`)
      .action(async (options) => {
        await _run({
          ...options,
          manifest: parseManifestFileOption(
            options.manifestFile,
            defaultWorkflowManifest
          ),
          clientConfig: await parseClientConfigOption(options.clientConfig),
          outputFile: options.outputFile
            ? parseWorkflowOutputFilePathOption(options.outputFile)
            : undefined,
        });
      });
  },
};

const _run = async (options: WorkflowCommandOptions) => {
  const { manifest, clientConfig, outputFile, quiet, jobs } = options;

  const manifestPath = path.resolve(manifest);
  const workflow = await loadWorkflowManifest(manifestPath, quiet);
  validateJobNames(workflow.jobs);
  const validationScript = workflow.validation
    ? loadValidationScript(manifestPath, workflow.validation)
    : undefined;

  const workflowOutput: WorkflowOutput[] = [];

  const onExecution = (id: string, jobResult: JobResult) => {
    const { data, error, status } = jobResult;

    if (error !== undefined) {
      process.exitCode = 1;
    }

    const output: WorkflowOutput = { id, status, data, error };
    workflowOutput.push(output);

    let validation: ValidationResult | undefined = undefined;
    if (status === JobStatus.SUCCEED && validationScript) {
      validation = validateOutput(output, validationScript);
    }

    if (!quiet) {
      printJobOutput(output, validation);
    }
  };

  const jobRunner = new JobRunner(clientConfig, onExecution);
  await jobRunner.run(workflow.jobs, jobs ?? Object.keys(workflow.jobs));

  if (outputFile) {
    const outputFileExt = path.extname(outputFile).substring(1);
    if (!outputFileExt) throw new Error("Require output file extension");
    switch (outputFileExt) {
      case "yaml":
      case "yml":
        fs.writeFileSync(outputFile, yaml.dump(workflowOutput));
        break;
      case "json":
        fs.writeFileSync(outputFile, JSON.stringify(workflowOutput, null, 2));
        break;
      default:
        throw new Error(
          intlMsg.commands_run_error_unsupportedOutputFileExt({ outputFileExt })
        );
    }
  }
};
