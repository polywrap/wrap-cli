import { CompilerOverrides } from "../../Compiler";
import { runCommand } from "../../system";
import { SourceBuildStrategy } from "../SourceBuilder";

export class LocalBuildStrategy extends SourceBuildStrategy<void> {
  public async getCompilerOverrides(): Promise<CompilerOverrides | undefined> {
    return undefined;
  }

  public async build(): Promise<void> {
    const manifest = await this.project.getManifest();
    const projectType = manifest.project.type; // e.g. "wasm/rust"
    await runCommand(
      `${__dirname}/../../defaults/build-scripts/${projectType}`,
      true
    );
  }
}
