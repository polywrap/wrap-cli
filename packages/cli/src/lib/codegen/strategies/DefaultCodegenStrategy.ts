import { AnyProjectManifest, Project } from "../../project";
import { CodegenStrategy } from "../CodegenStrategy";
import { resetDir } from "../../system";

import { writeDirectorySync } from "@polywrap/os-js";
import { BindLanguage } from "@polywrap/schema-bind";
import { Abi } from "@polywrap/wrap-manifest-types-js";
import { Ora } from "ora";
import path from "path";

export class DefaultCodegenStrategy extends CodegenStrategy {
  private _codegenDirAbs?: string;
  private _abi: Abi;

  constructor(config: {
    project: Project<AnyProjectManifest>;
    abi: Abi;
    codegenDirAbs?: string;
  }) {
    super(config);

    this._abi = config.abi;
    this._codegenDirAbs = config.codegenDirAbs;
  }

  public async generate(_: BindLanguage, _a?: Ora): Promise<string[]> {
    const codegenDir = this._codegenDirAbs
      ? path.relative(this.project.getManifestDir(), this._codegenDirAbs)
      : undefined;

    const binding = await this.project.generateSchemaBindings(
      this._abi,
      codegenDir
    );

    resetDir(binding.outputDirAbs);
    return writeDirectorySync(binding.outputDirAbs, binding.output);
  }
}
