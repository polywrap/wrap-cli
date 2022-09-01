import { AnyProjectManifest, Project } from "../project";
import { SchemaComposer } from "../SchemaComposer";

import { BindLanguage } from "@polywrap/schema-bind";
import { Ora } from "ora";

export abstract class CodegenStrategy {
  public readonly project: Project<AnyProjectManifest>;
  protected schemaComposer: SchemaComposer;

  constructor(config: {
    project: Project<AnyProjectManifest>;
    schemaComposer: SchemaComposer;
  }) {
    this.project = config.project;
    this.schemaComposer = config.schemaComposer;
  }

  public abstract generate(
    bindLanguage: BindLanguage,
    spinner?: Ora
  ): Promise<string[]>;
}
