import { Step, StepName, StepResult, UriOrPrevStepResult } from "./step";

import { Uri } from "@polywrap/core-js";
import { GluegunPrint } from "gluegun";

export interface SequenceResult {
  name: string;
  steps: {
    id: string;
    name: string;
    input: Uri;
    result: Uri;
  }[];
}

interface SequenceArgs {
  name: string;
  steps: Step[];
  config: Record<string, unknown>;
  printer: GluegunPrint;
}

export class Sequence {
  public name: string;
  public steps: Step[];
  public config: Record<string, unknown>;

  private _printer: GluegunPrint;
  private _resultMap: Map<StepName, StepResult> = new Map();

  constructor(config: SequenceArgs) {
    this.name = config.name;
    this.steps = config.steps;
    this.config = config.config;

    this._printer = config.printer;

    this.steps.forEach((step, index) => {
      if (step.uriOrStepResult.startsWith("$")) {
        const previousStepsNames = this.steps
          .slice(0, index)
          .map((s) => s.name);

        const dependencyStepName = step.uriOrStepResult.slice(1);

        if (!previousStepsNames.includes(dependencyStepName)) {
          throw new Error(
            `Step '${step.name}' depends on '${dependencyStepName}'s result, but '${dependencyStepName}' is not listed before '${step.name}' in sequence '${this.name}'`
          );
        }
      }
    });
  }

  public async run(): Promise<SequenceResult> {
    this._printer.info(
      `\n\nExecuting '${this.name}' deployment sequence: \n${this.steps
        .map((s) => `\n- ${s.name}`)
        .join("")}\n\n`
    );

    for await (const step of this.steps) {
      const uri = this._getUriArgument(step.uriOrStepResult);

      this._printer.info(
        `Executing step: '${step.name}', with URI: '${uri.toString()}'`
      );

      try {
        const result = await step.run(uri, {
          // Step level config will override Sequence level config
          ...this.config,
          ...step.config,
        });
        this._resultMap.set(step.name, {
          id: `${this.name}.${step.name}`,
          input: uri,
          result,
        });

        this._printer.success(
          `Successfully executed step '${
            step.name
          }'. Result: '${result.toString()}'`
        );
      } catch (e) {
        throw new Error(`Failed to execute step '${step.name}'. Error: ${e}`);
      }
    }

    this._printer.info(
      `\n\nSuccessfully executed '${this.name}' deployment sequence\n\n`
    );

    return {
      name: this.name,
      steps: this.steps.map((s) => ({
        name: s.name,
        ...(this._resultMap.get(s.name) as StepResult),
      })),
    };
  }

  private _getUriArgument(uriOrStepResult: UriOrPrevStepResult): Uri {
    if (uriOrStepResult.startsWith("$")) {
      const previousStepResult = this._resultMap.get(uriOrStepResult.slice(1));

      if (!previousStepResult) {
        throw new Error(`Could not find ${uriOrStepResult.slice(1)}'s result`);
      }

      return previousStepResult.result;
    }

    return new Uri(uriOrStepResult);
  }
}
