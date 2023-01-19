import { DeployModule } from "./DeployModule";

import { Uri } from "@polywrap/core-js";

export type StepName = string;
export type UriOrPrevStepResult = string;

export interface StepResult {
  id: string;
  input: Uri;
  result: Uri;
}

interface StepArgs {
  name: string;
  uriOrStepResult: UriOrPrevStepResult;
  deployModule: DeployModule;
  config: Record<string, unknown>;
}

export class DeployStep {
  public name: string;
  public deployModule: DeployModule;
  public uriOrStepResult: string;
  public config: Record<string, unknown>;

  constructor(args: StepArgs) {
    this.name = args.name;
    this.deployModule = args.deployModule;
    this.uriOrStepResult = args.uriOrStepResult;
    this.config = args.config;
  }

  public async run(uri: Uri, config: Record<string, unknown>): Promise<Uri> {
    return await this.deployModule.execute(uri, config);
  }
}
