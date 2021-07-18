import { query } from "./resolvers";
import { manifest } from "./manifest";
import { RequestData, RequestError } from "./types";

import {
  Plugin,
  PluginFactory,
  PluginManifest,
  PluginModules,
} from "@web3api/core-js";
import { HttpPlugin } from "@web3api/http-plugin-js";

export interface GraphNodeConfig {
  provider: string;
}

export class GraphNodePlugin extends Plugin {
  private _http = new HttpPlugin();

  constructor(private _config: GraphNodeConfig) {
    super();
  }

  public static manifest(): PluginManifest {
    return manifest;
  }

  // TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
  // https://github.com/web3-api/monorepo/issues/101
  public getModules(): PluginModules {
    return {
      query: query(this),
    };
  }

  public async query(
    author: string,
    name: string,
    query: string
  ): Promise<string> {
    const response = await this._http.post(
      `${this._config.provider}/subgraphs/name/${author}/${name}`,
      {
        body: JSON.stringify({
          query,
        }),
        responseType: "TEXT",
      }
    );

    const responseJson = (response.body as unknown) as
      | RequestError
      | RequestData;

    const errors = (responseJson as RequestError).errors;
    console.log(errors);

    if (errors) {
      throw new Error(`GraphNodePlugin: errors in query string. Errors:
        ${errors
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
