/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project, AnyManifest, getSimpleClient } from "./";

import { Uri, Web3ApiClient } from "@web3api/client-js";
import {
  composeSchema,
  ComposerOutput,
  ComposerFilter,
  ComposerOptions,
  SchemaKind,
  SchemaFile,
} from "@web3api/schema-compose";
import fs from "fs";
import path from "path";
import * as gluegun from "gluegun";

export interface SchemaComposerConfig {
  project: Project<AnyManifest>;

  // TODO: add this to the project configuration
  //       and make it configurable
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
  client?: Web3ApiClient;
}

export class SchemaComposer {
  private _client: Web3ApiClient;
  private _composerOutput: ComposerOutput | undefined;

  constructor(private _config: SchemaComposerConfig) {
    this._client = this._config.client ?? getSimpleClient(this._config);
  }

  public async getComposedSchemas(
    output: ComposerFilter = ComposerFilter.All
  ): Promise<ComposerOutput> {
    if (this._composerOutput) {
      return Promise.resolve(this._composerOutput);
    }

    const { project } = this._config;

    const schemaNamedPaths = await project.getSchemaNamedPaths();
    const import_redirects = await project.getImportRedirects();

    const getSchemaFile = (schemaPath?: string): SchemaFile | undefined =>
      schemaPath
        ? {
            schema: this._fetchLocalSchema(schemaPath),
            absolutePath: schemaPath,
          }
        : undefined;

    const options: ComposerOptions = {
      schemas: {},
      resolvers: {
        external: (uri: string) =>
          this._fetchExternalSchema(uri, import_redirects),
        local: (path: string) => Promise.resolve(this._fetchLocalSchema(path)),
      },
      output,
    };

    for (const name of Object.keys(schemaNamedPaths)) {
      const schemaPath = schemaNamedPaths[name];
      const schemaFile = getSchemaFile(schemaPath);

      if (!schemaFile) {
        throw Error(`Schema "${name}" cannot be loaded at path: ${schemaPath}`);
      }

      const isPlugin = false;
      // (await project.getManifestLanguage()).indexOf("plugin/") > -1;

      if (isPlugin) {
        options.schemas.plugin = schemaFile;
      } else {
        // TODO: this is bad, will remove when we don't have "fixed" schema kinds,
        // and just have individual modules
        options.schemas[name as SchemaKind] = schemaFile;
      }
    }

    this._composerOutput = await composeSchema(options);

    return this._composerOutput;
  }

  public reset(): void {
    this._composerOutput = undefined;
  }

  private async _fetchExternalSchema(
    uri: string,
    import_redirects?: {
      uri: string;
      schema: string;
    }[]
  ): Promise<string> {
    // Check to see if we have any import redirects that match
    if (import_redirects) {
      for (const redirect of import_redirects) {
        const redirectUri = new Uri(redirect.uri);
        const uriParsed = new Uri(uri);

        if (Uri.equals(redirectUri, uriParsed)) {
          return this._fetchLocalSchema(redirect.schema);
        }
      }
    }

    try {
      return await this._client.getSchema(new Uri(uri));
    } catch (e) {
      gluegun.print.error(e);
      throw e;
    }
  }

  private _fetchLocalSchema(schemaPath: string) {
    path.isAbsolute(
      schemaPath
        ? schemaPath
        : path.join(this._config.project.getRootDir(), schemaPath)
    );
    return fs.readFileSync(
      path.isAbsolute(schemaPath)
        ? schemaPath
        : path.join(this._config.project.getManifestDir(), schemaPath),
      "utf-8"
    );
  }
}
