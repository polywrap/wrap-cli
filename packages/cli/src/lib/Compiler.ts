/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project } from "./Project";
import { SchemaComposer } from "./SchemaComposer";
import { withSpinner, outputManifest } from "./helpers";
import {
  BuildVars,
  ModulesToBuild,
  parseManifest,
} from "./helpers/build-manifest";
import { buildImage, copyFromImageToHost } from "./helpers/docker";

import { readdirSync } from "fs";
import { bindSchema, writeDirectory } from "@web3api/schema-bind";
import path from "path";
import fs from "fs";
import * as gluegun from "gluegun";
import { Manifest } from "@web3api/core-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const fsExtra = require("fs-extra");

export interface CompilerConfig {
  outputDir: string;
  project: Project;
  schemaComposer: SchemaComposer;
}

export class Compiler {
  constructor(private _config: CompilerConfig) {}

  public async compile(): Promise<boolean> {
    try {
      // Compile the API
      await this._compileWeb3Api();

      return true;
    } catch (e) {
      gluegun.print.error(e);
      return false;
    }
  }

  private _copySources({
    dockerfilePath,
    tempDirPath,
    ignorePaths,
  }: {
    ignorePaths: string[];
    dockerfilePath: string;
    tempDirPath: string;
  }) {
    fsExtra.removeSync(tempDirPath);
    fsExtra.copySync(dockerfilePath, `${tempDirPath}/Dockerfile`);

    const files = readdirSync(process.cwd(), { withFileTypes: true }).filter(
      (file) => file.name !== ".w3"
    );
    const fullIgnorePaths = ignorePaths.map((ignorePath) =>
      path.join(process.cwd(), ignorePath)
    );

    files.forEach((file) => {
      fsExtra.copySync(
        path.join(process.cwd(), file.name),
        path.join(tempDirPath, file.name),
        {
          overwrite: false,
          filter: (pathString: string) => !fullIgnorePaths.includes(pathString),
        }
      );
    });
  }

  private async _buildSourcesInDocker(
    {
      outputImageName,
      paths: { tempDir, outputDir, dockerfile },
      ignorePaths,
      args,
    }: BuildVars,
    quiet = true
  ) {
    this._copySources({
      dockerfilePath: dockerfile,
      ignorePaths,
      tempDirPath: tempDir,
    });

    await buildImage(
      {
        tempDir,
        outputImageName,
        args,
      },
      quiet
    );

    await copyFromImageToHost(
      {
        tempDir,
        imageName: outputImageName,
        source: outputDir, //build folder inside docker
        destination: path.join("..", "..", outputDir),
      },
      quiet
    );
  }

  private _determineModulesToBuild(
    manifest: Manifest
  ): ModulesToBuild | undefined {
    const manifestMutation = manifest.mutation;
    const manifestQuery = manifest.query;

    if (manifestMutation && manifestQuery) {
      return "both";
    }

    if (manifestMutation) {
      return "mutation";
    }

    if (manifestQuery) {
      return "query";
    }

    return undefined;
  }

  private async _compileWeb3Api() {
    const { outputDir, project, schemaComposer } = this._config;

    const run = async (): Promise<void> => {
      // Init & clean build directory
      this._cleanDir(this._config.outputDir);

      const manifest = await project.getManifest();

      // Get the fully composed schema
      const composed = await schemaComposer.getComposedSchemas();

      if (!composed.combined) {
        throw Error(
          "compileWeb3Api: Schema composer failed to return a combined schema."
        );
      }

      const generateModuleCode = async (moduleName: "mutation" | "query") => {
        const module = manifest[moduleName];

        if (!module) {
          return;
        }

        if (!composed[moduleName]) {
          throw Error(
            `Missing schema definition for the module "${moduleName}"`
          );
        }

        // Generate code next to the module entry point file
        this._generateCode(module.module.file, composed[moduleName] as string);

        module.module.file = `./${moduleName}.wasm`;
        module.schema.file = "./schema.graphql";
      };

      await generateModuleCode("mutation");
      await generateModuleCode("query");

      const modulesToBuild = this._determineModulesToBuild(manifest);

      if (modulesToBuild) {
        const buildVars = parseManifest(modulesToBuild);
        // Output the schema & manifest files
        const schemaPath = `${outputDir}/schema.graphql`;
        fs.writeFileSync(schemaPath, composed.combined, "utf-8");

        const manifestPath = `${outputDir}/web3api.yaml`;
        await outputManifest(manifest, manifestPath);

        // Build sources
        await this._buildSourcesInDocker(buildVars, project.quiet);
      }
    };

    if (project.quiet) {
      return run();
    } else {
      return await withSpinner(
        "Compile Web3API",
        "Failed to compile Web3API",
        "Warnings while compiling Web3API",
        async () => {
          return run();
        }
      );
    }
  }

  private _generateCode(entryPoint: string, schema: string): string[] {
    const { project } = this._config;

    const absolute = path.isAbsolute(entryPoint)
      ? entryPoint
      : this._appendPath(project.manifestPath, entryPoint);
    const directory = `${path.dirname(absolute)}/w3`;

    // Clean the code generation
    this._cleanDir(directory);

    // Generate the bindings
    const output = bindSchema("wasm-as", schema);

    // Output the bindings
    return writeDirectory(directory, output);
  }

  private _appendPath(root: string, subPath: string) {
    return path.join(path.dirname(root), subPath);
  }

  private _cleanDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fsExtra.emptyDirSync(dir);
  }
}
