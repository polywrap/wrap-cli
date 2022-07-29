/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project, AnyProjectManifest, ImportRedirects } from "./";

import { Uri, PolywrapClient } from "@polywrap/client-js";
import {
  composeSchema,
  ComposerOptions,
  SchemaFile,
} from "@polywrap/schema-compose";
import fs from "fs";
import path from "path";
import * as gluegun from "gluegun";
import { deserializeWrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Abi } from "@polywrap/schema-parse";

export interface SchemaComposerConfig {
  project: Project<AnyProjectManifest>;
  client: PolywrapClient;
}

export class SchemaComposer {
  private _client: PolywrapClient;
  private _abi: Abi | undefined;

  constructor(private _config: SchemaComposerConfig) {
    this._client = this._config.client;
  }

  public async getComposedAbis(): Promise<Abi> {
    if (this._abi) {
      return Promise.resolve(this._abi);
    }

    const { project } = this._config;

    const schemaNamedPath = await project.getSchemaNamedPath();
    const import_redirects = await project.getImportRedirects();

    const getSchemaFile = (schemaPath?: string): SchemaFile | undefined =>
      schemaPath
        ? {
            schema: fs.readFileSync(schemaPath, "utf-8"),
            absolutePath: schemaPath,
          }
        : undefined;
    const schemaFile = getSchemaFile(schemaNamedPath);
    if (!schemaFile) {
      throw Error(`Schema cannot be loaded at path: ${schemaNamedPath}`);
    }

    const options: ComposerOptions = {
      schemaFile,
      resolvers: {
        external: (uri: string) =>
          this._fetchExternalAbi(uri, import_redirects),
        local: (path: string) => Promise.resolve(this._fetchLocalSchema(path)),
      },
    };

    this._abi = (await composeSchema(options)) as Abi;
    return this._abi;
  }

  public reset(): void {
    this._abi = undefined;
  }

  private async _fetchExternalAbi(
    uri: string,
    import_redirects?: ImportRedirects
  ): Promise<Abi> {
    // Check to see if we have any import redirects that match
    if (import_redirects) {
      for (const redirect of import_redirects) {
        const redirectUri = new Uri(redirect.uri);
        const uriParsed = new Uri(uri);

        if (Uri.equals(redirectUri, uriParsed)) {
          const manifest = fs.readFileSync(
            path.join(this._config.project.getManifestDir(), redirect.info)
          );
          return ((await deserializeWrapManifest(manifest))
            .abi as unknown) as Abi;
        }
      }
    }

    try {
      const manifest = await this._client.getManifest(new Uri(uri));
      return (manifest.abi as unknown) as Abi;
    } catch (e) {
      gluegun.print.error(e);
      throw e;
    }
  }

  private _fetchLocalSchema(schemaPath: string) {
    return fs.readFileSync(
      path.isAbsolute(schemaPath)
        ? schemaPath
        : path.join(this._config.project.getManifestDir(), schemaPath),
      "utf-8"
    );
  }
}
