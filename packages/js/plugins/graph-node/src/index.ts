import { query } from "./resolvers";
import { manifest } from "./manifest";
import { RequestData, RequestError } from "./types";

import {
  Client,
  Plugin,
  PluginFactory,
  PluginManifest,
  PluginModules,
} from "@web3api/core-js";

export interface GraphNodeConfig {
  provider: string;
}

export class GraphNodePlugin extends Plugin {
  constructor(private _config: GraphNodeConfig) {
    super();
  }

  public static manifest(): PluginManifest {
    return manifest;
  }

  // TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
  // https://github.com/web3-api/monorepo/issues/101
  public getModules(client: Client): PluginModules {
    return {
      query: query(this, client),
    };
  }

  public async query(
    author: string,
    name: string,
    query: string,
    client: Client
  ): Promise<string> {
    const { data, errors } = await client.query<{
      post: {
        status: number;
        statusText: string;
        headers: { key: string; value: string }[];
        body: string;
      };
    }>({
      uri: "ens/http.web3api.eth",
      query: `query {
        post(
          url: $url,
          request: $request
        )
      }`,
      variables: {
        url: `${this._config.provider}/subgraphs/name/${author}/${name}`,
        request: {
          body: JSON.stringify({
            query,
          }),
          responseType: "TEXT",
        },
      },
    });

    if (errors) {
      throw new Error(`GraphNodePlugin: errors encountered. Errors:
        ${errors.map((err: Error) => JSON.stringify(err)).join("\n")}
      `);
    }

    if (!data || !data.post) {
      throw new Error(`GraphNodePlugin: data is undefined.`);
    }

    const responseJson = (data.post.body as unknown) as
      | RequestError
      | RequestData;

    const responseErrors = (responseJson as RequestError).errors;

    if (responseErrors) {
      throw new Error(`GraphNodePlugin: errors in query string. Errors:
        ${responseErrors
          .map((err) =>
            err.locations
              ? `\n -Locations: ${err.locations
                  .map((loc) => `(col: ${loc.column}, line: ${loc.line})`)
                  .join(", ")} \n-Message: ${err.message}`
              : `\n-Message: ${err.message}`
          )
          .join("\n")}
      `);
    }

    return JSON.stringify(responseJson);
  }
}

export const graphNodePlugin: PluginFactory<GraphNodeConfig> = (
  opts: GraphNodeConfig
) => {
  return {
    factory: () => new GraphNodePlugin(opts),
    manifest: manifest,
  };
};
export const plugin = graphNodePlugin;
