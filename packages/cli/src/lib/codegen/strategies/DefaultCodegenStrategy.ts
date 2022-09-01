import { AnyProjectManifest, Project } from "../../project";
import { CodegenStrategy } from "../CodegenStrategy";
import { resetDir } from "../../system";
import { SchemaComposer } from "../../SchemaComposer";

import { writeDirectorySync } from "@polywrap/os-js";
import { BindLanguage } from "@polywrap/schema-bind";
import { Ora } from "ora";
import path from "path";

export class DefaultCodegenStrategy extends CodegenStrategy {
  private _codegenDirAbs?: string;

  constructor(config: {
    project: Project<AnyProjectManifest>;
    schemaComposer: SchemaComposer;
    codegenDirAbs?: string;
  }) {
    super(config);

    this._codegenDirAbs = config.codegenDirAbs;
  }

  public async generate(_: BindLanguage, _a?: Ora): Promise<string[]> {
    const codegenDir = this._codegenDirAbs
      ? path.relative(this.project.getManifestDir(), this._codegenDirAbs)
      : undefined;

    const abi = await this.schemaComposer.getComposedAbis();
    const binding = await this.project.generateSchemaBindings(abi, codegenDir);

    resetDir(binding.outputDirAbs);
    return writeDirectorySync(binding.outputDirAbs, binding.output);
  }
}
