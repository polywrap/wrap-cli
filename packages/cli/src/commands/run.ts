import { Command, Program } from "./types";
import { intlMsg } from "../lib";
import {
  parseClientConfigOption,
  parseWorkflowOutputFilePathOption,
} from "../lib/parsers";

import { InvokeApiResult, Workflow } from "@web3api/core-js";
import { Web3ApiClient, Web3ApiClientConfig } from "@web3api/client-js";
import path from "path";
import yaml from "js-yaml";
import fs from "fs";

type WorkflowCommandOptions = {
  clientConfig: Partial<Web3ApiClientConfig>;
  jobs?: string[];
  outputFile?: string;
  quiet?: boolean;
};

export const run: Command = {
  setup: (program: Program) => {
    program
      .command("run")
      .alias("r")
      .description(intlMsg.commands_run_description())
      .argument("<workflow>", intlMsg.commands_run_options_workflowScript())
      .option(
        `-c, --client-config <${intlMsg.commands_run_options_configPath()}> `,
        `${intlMsg.commands_run_options_config()}`
      )
      .option(
        `-o, --output-file <${intlMsg.commands_run_options_outputFilePath()}>`,
        `${intlMsg.commands_run_options_outputFile()}`
      )
      .option(`-j, --jobs <jobs...>`, intlMsg.commands_run_options_jobs())
      .option(`-q, --quiet`, `${intlMsg.commands_run_options_quiet()}`)
      .action(async (workflow: string, options) => {
        await _run(workflow, {
          ...options,
          clientConfig: await parseClientConfigOption(
            options.clientConfig,
            undefined
          ),
          outputFile: options.outputFile
            ? parseWorkflowOutputFilePathOption(options.outputFile, undefined)
            : undefined,
        });
      });
  },
};

const _run = async (workflowPath: string, options: WorkflowCommandOptions) => {
  const { clientConfig, outputFile, quiet, jobs } = options;
  const client = new Web3ApiClient(clientConfig);

  function getParser(path: string) {
    return path.endsWith(".yaml") || path.endsWith(".yml")
      ? yaml.load
      : JSON.parse;
  }

  const workflow: Workflow = getParser(workflowPath)(
    fs.readFileSync(workflowPath).toString()
  );
  const workflowOutput: (InvokeApiResult & { id: string })[] = [];

  await client.run({
    workflow,
    config: clientConfig,
    ids: jobs,
    onExecution: (id, data, error) => {
      if (!quiet) {
        console.log("-----------------------------------");
        console.log(`ID: ${id}`);
      }

      if (!quiet && data && data !== {}) {
        console.log(`Data: ${JSON.stringify(data, null, 2)}`);
        console.log("-----------------------------------");
      }

      if (!quiet && error) {
        console.log(`Error: ${error.message}`);
        console.log(error.stack || "");
        console.log("-----------------------------------");
        process.exitCode = 1;
      }

      workflowOutput.push({ id, data, error });
    },
  });

  if (outputFile) {
    const outputFileExt = path.extname(outputFile).substring(1);
    if (!outputFileExt) throw new Error("Require output file extention");
    switch (outputFileExt) {
      case "yaml":
      case "yml":
        fs.writeFileSync(outputFile, yaml.dump(workflowOutput));
        break;
      case "json":
        fs.writeFileSync(outputFile, JSON.stringify(workflowOutput, null, 2));
        break;
      default:
        throw new Error(`Unsupported outputFile extention: ${outputFileExt}`);
    }
  }
};
