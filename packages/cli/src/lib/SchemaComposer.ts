/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Project } from "./Project";

import { Manifest, Uri, Web3ApiClient, UriRedirect } from "@web3api/client-js";
import { composeSchema, ComposerOutput } from "@web3api/schema-compose";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";
import fs from "fs";
import path from "path";
import * as gluegun from "gluegun";

export interface SchemaConfig {
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

  constructor(private _config: SchemaConfig) {
    const { ensAddress, ethProvider, ipfsProvider } = this._config;
    const redirects: UriRedirect[] = [];

    if (ensAddress) {
      redirects.push({
        from: new Uri("w3://ens/ens.web3api.eth"),
        to: {
          factory: () => new EnsPlugin({ address: ensAddress }),
          manifest: EnsPlugin.manifest(),
        },
      });
    }

    if (ethProvider) {
      redirects.push({
        from: new Uri("w3://ens/ethereum.web3api.eth"),
        to: {
          factory: () => new EthereumPlugin({ provider: ethProvider }),
          manifest: EthereumPlugin.manifest(),
        },
      });
    }

    if (ipfsProvider) {
      redirects.push({
        from: new Uri("w3://ens/ipfs.web3api.eth"),
        to: {
          factory: () => new IpfsPlugin({ provider: ipfsProvider }),
          manifest: IpfsPlugin.manifest(),
        },
      });
    }

    this._client = new Web3ApiClient({ redirects });
  }

  public async getComposedSchemas(): Promise<ComposerOutput> {
    if (this._composerOutput) {
      return Promise.resolve(this._composerOutput);
    }

    const { project } = this._config;

    const manifest = await project.getManifest();
    const querySchemaPath = manifest.query?.schema.file;
    const mutationSchemaPath = manifest.mutation?.schema.file;

    this._composerOutput = await composeSchema({
      schemas: {
        query: querySchemaPath
          ? {
              schema: this._fetchLocalSchema(querySchemaPath),
              absolutePath: querySchemaPath,
            }
          : undefined,
        mutation: mutationSchemaPath
          ? {
              schema: this._fetchLocalSchema(mutationSchemaPath),
              absolutePath: mutationSchemaPath,
            }
          : undefined,
      },
      resolvers: {
        external: (uri: string) => this._fetchExternalSchema(uri, manifest),
        local: (path: string) => Promise.resolve(this._fetchLocalSchema(path)),
      },
    });

    return this._composerOutput;
  }

  private async _fetchExternalSchema(
    uri: string,
    manifest: Manifest
  ): Promise<string> {
    // Check to see if we have any import redirects that match
    if (manifest.import_redirects) {
      for (const redirect of manifest.import_redirects) {
        const redirectUri = new Uri(redirect.uri);
        const uriParsed = new Uri(uri);

        if (Uri.equals(redirectUri, uriParsed)) {
          return this._fetchLocalSchema(redirect.schema);
        }
      }
    }

    try {
      const api = await this._client.loadWeb3Api(new Uri(uri));
      return await api.getSchema(this._client);
    } catch (e) {
      gluegun.print.error(e);
      throw e;
    }
  }

  private _fetchLocalSchema(schemaPath: string) {
    return fs.readFileSync(
      path.isAbsolute(schemaPath)
        ? schemaPath
        : this._appendPath(this._config.project.manifestPath, schemaPath),
      "utf-8"
    );
  }

  private _appendPath(root: string, subPath: string) {
    return path.join(path.dirname(root), subPath);
  }
}
