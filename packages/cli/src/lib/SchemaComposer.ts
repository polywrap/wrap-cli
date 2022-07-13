/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { AnyProjectManifest, Project } from "./";

import { PolywrapClient, Uri } from "@polywrap/client-js";
import {
  ComposerOptions,
  ComposerOutput,
  composeSchema,
  ManifestFile,
} from "@polywrap/schema-compose";
import fs from "fs";
import path from "path";
import * as gluegun from "gluegun";
import { Abi } from "@polywrap/schema-parse";
import { deserializeWrapManifest } from "@polywrap/wrap-manifest-types-js";

export interface SchemaComposerConfig {
  project: Project<AnyProjectManifest>;
  client: PolywrapClient;
}

export class SchemaComposer {
  private _client: PolywrapClient;
  private _composerOutput: ComposerOutput | undefined;

  constructor(private _config: SchemaComposerConfig) {
    this._client = this._config.client;
  }

  public async getComposedAbis(): Promise<ComposerOutput> {
    if (this._composerOutput) {
      return Promise.resolve(this._composerOutput);
    }

    const { project } = this._config;

    const manifestNamedPath = await project.getSchemaNamedPath();
    const import_redirects = await project.getImportRedirects();

    const getManifest = (manifestPath?: string): ManifestFile | undefined =>
      manifestPath
        ? {
            abi: this._fetchLocalManifest(manifestPath),
            absolutePath: manifestPath,
          }
        : undefined;

    const options: ComposerOptions = {
      abis: [],
      resolvers: {
        external: (uri: string) =>
          this._fetchExternalManifest(uri, import_redirects),
        local: (path: string) =>
          Promise.resolve(this._fetchLocalManifest(path)),
      },
    };

    const manifest = getManifest(manifestNamedPath);
    if (!manifest) {
      throw Error(`Manifest cannot be loaded at path: ${manifestNamedPath}`);
    }

    options.abis.push(manifest.abi);

    this._composerOutput = await composeSchema(options);
    return this._composerOutput;
  }

  public reset(): void {
    this._composerOutput = undefined;
  }

  private async _fetchExternalManifest(
    uri: string,
    import_redirects?: {
      uri: string;
      schema: string;
    }[]
  ): Promise<Abi> {
    // Check to see if we have any import redirects that match
    if (import_redirects) {
      for (const redirect of import_redirects) {
        const redirectUri = new Uri(redirect.uri);
        const uriParsed = new Uri(uri);

        if (Uri.equals(redirectUri, uriParsed)) {
          return this._fetchLocalManifest(redirect.schema);
        }
      }
    }

    // Need to work from here outwards: CLI -> Client -> Core + schema
    try {
      const { abi } = await this._client.getManifest(new Uri(uri));
      // TODO: Remove as unknown once Abi JSON Schema has been implemented
      return (abi as unknown) as Abi;
    } catch (e) {
      gluegun.print.error(e);
      throw e;
    }
  }

  private _fetchLocalManifest(manifestPath: string): Abi {
    const currentPath = path.isAbsolute(manifestPath)
      ? manifestPath
      : path.join(this._config.project.getManifestDir(), manifestPath);
    const manifest = fs.readFileSync(currentPath);
    const { abi } = deserializeWrapManifest(manifest);
    // TODO: Remove as unknown once Abi JSON Schema has been implemented
    return (abi as unknown) as Abi;
  }
}
