/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project } from "./project";

import { Uri, Web3ApiClient, PluginRegistration } from "@web3api/client-js";
import {
  composeSchema,
  ComposerOutput,
  ComposerFilter,
  ComposerOptions,
} from "@web3api/schema-compose";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import fs from "fs";
import path from "path";
import * as gluegun from "gluegun";
import { SchemaFile } from "@web3api/schema-compose";

export interface SchemaComposerConfig {
  project: Project;

  // TODO: add this to the project configuration
  //       and make it configurable
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
}

export class SchemaComposer {
  private _client: Web3ApiClient;
  private _composerOutput: ComposerOutput | undefined;

  constructor(private _config: SchemaComposerConfig) {
    const { ensAddress, ethProvider, ipfsProvider } = this._config;
    const plugins: PluginRegistration[] = [];

    if (ensAddress) {
      plugins.push({
        uri: "w3://ens/ens.web3api.eth",
        plugin: ensPlugin({
          addresses: {
            testnet: ensAddress,
          },
        }),
      });
    }

    if (ethProvider) {
      plugins.push({
        uri: "w3://ens/ethereum.web3api.eth",
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethProvider,
            },
          },
        }),
      });
    }

    if (ipfsProvider) {
      plugins.push({
        uri: "w3://ens/ipfs.web3api.eth",
        plugin: ipfsPlugin({
          provider: ipfsProvider,
          fallbackProviders: ["https://ipfs.io"],
        }),
      });
    }

    this._client = new Web3ApiClient({ plugins });
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

      options.schemas[name] = schemaFile;
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
    return fs.readFileSync(
      path.isAbsolute(schemaPath)
        ? schemaPath
        : path.join(this._config.project.getRootDir(), schemaPath),
      "utf-8"
    );
  }
}
