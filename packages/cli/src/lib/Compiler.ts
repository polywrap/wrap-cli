/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project } from "./Project";
import { SchemaComposer } from "./SchemaComposer";
import { withSpinner, outputManifest } from "./helpers";
import { copyDir } from "../lib/helpers/copy";
import { BuildVars, parseManifest } from "./helpers/build-manifest";
import { buildImage, copyFromImageToHost } from "./helpers/docker";

import { bindSchema, writeDirectory } from "@web3api/schema-bind";
import path from "path";
import fs, { copyFileSync, statSync } from "fs";
import * as gluegun from "gluegun";

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
    sources,
    dockerfilePath,
    tempDirPath,
  }: {
    sources: string[];
    dockerfilePath: string;
    tempDirPath: string;
  }) {
    copyDir(dockerfilePath, path.join(tempDirPath));

    sources.forEach((source) => {
      const isDir = statSync(source).isDirectory();

      if (isDir) {
        copyDir(source, path.join(tempDirPath, path.basename(source)));
      } else {
        copyFileSync(source, path.join(tempDirPath, path.basename(source)));
      }
    });
  }

  private async _buildSourcesInDocker(
    {
      outputImageName,
      paths: { tempDir, outputDir, dockerfile },
      sources,
      args,
    }: BuildVars,
    quiet = true
  ) {
    this._copySources({
      dockerfilePath: dockerfile,
      sources,
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
        sourceDir: outputDir, //build folder inside docker
        destinationDir: path.join("..", "..", outputDir),
      },
      quiet
    );
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

      const buildVars = parseManifest();

      await this._buildSourcesInDocker(buildVars, project.quiet);

      // Output the schema & manifest files
      fs.writeFileSync(
        `${outputDir}/schema.graphql`,
        composed.combined,
        "utf-8"
      );
      await outputManifest(manifest, `${outputDir}/web3api.yaml`);
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
