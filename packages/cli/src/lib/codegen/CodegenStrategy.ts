import { AnyProjectManifest, Project } from "../project";

import { BindLanguage } from "@polywrap/schema-bind";
import { Abi } from "@polywrap/wrap-manifest-types-js";
import { Ora } from "ora";

export abstract class CodegenStrategy {
  public readonly project: Project<AnyProjectManifest>;
  protected abi: Abi;

  constructor(config: { project: Project<AnyProjectManifest>; abi: Abi }) {
    this.project = config.project;
    this.abi = config.abi;
  }

  public abstract generate(
    bindLanguage: BindLanguage,
    spinner?: Ora
  ): Promise<string[]>;
}
