/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Web3ApiManifest } from "./Web3APIManifest";
import { displayPath } from "./helpers/path";
import { withSpinner } from "./helpers/spinner";
import { BuildConfig } from "./Compiler";

import fs from "fs";
import path from "path";
import { Manifest, Uri, Web3ApiClient, UriRedirect } from "@web3api/client-js";
import { composeSchema, ComposerOutput } from "@web3api/schema-compose";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";

export class SchemaComposer {
  constructor(private _config: BuildConfig) {}

  public async loadManifest(quiet = false): Promise<Manifest> {
    const run = () => {
      return Web3ApiManifest.load(this._config.manifestPath);
    };

    if (quiet) {
      return run();
    } else {
      const manifestPath = displayPath(this._config.manifestPath);

      return await withSpinner(
        `Load web3api from ${manifestPath}`,
        `Failed to load web3api from ${manifestPath}`,
        `Warnings loading web3api from ${manifestPath}`,
        async (_spinner) => {
          return run();
        }
      );
    }
  }

  public async composeSchemas(manifest: Manifest): Promise<ComposerOutput> {
    const querySchemaPath = manifest.query?.schema.file;
    const mutationSchemaPath = manifest.mutation?.schema.file;

    return composeSchema({
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

    const { ensAddress, ethProvider, ipfsProvider } = this._config;

    // If custom providers are supplied, try fetching the URI
    // with them added to the client first
    if (ensAddress || ethProvider || ipfsProvider) {
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

      try {
        const client = new Web3ApiClient({ redirects });
        const api = await client.loadWeb3Api(new Uri(uri));
        const schema = await api.getSchema(client);

        if (schema) {
          return schema;
        }
      } catch (e) {
        // Do nothing, try using the default client below
      }
    }

    // Try fetching the schema with a vanilla Web3API client
    const client = new Web3ApiClient();
    const api = await client.loadWeb3Api(new Uri(uri));
    return await api.getSchema(client);
  }

  private _fetchLocalSchema(schemaPath: string) {
    return fs.readFileSync(
      path.isAbsolute(schemaPath)
        ? schemaPath
        : this._appendPath(this._config.manifestPath, schemaPath),
      "utf-8"
    );
  }

  private _appendPath(root: string, subPath: string) {
    return path.join(path.dirname(root), subPath);
  }
}
