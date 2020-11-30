import {
  ExecuteOptions,
  ExecuteResult,
  Web3Api
} from "./";
import { filterExecuteResult } from "./execute";
import {
  Web3ApiClient,
  Web3ApiClientPlugin
} from "../";

export class PluginWeb3Api extends Web3Api {

  constructor(
    uri: string,
    private _plugin: Web3ApiClientPlugin
  ) {
    super(uri);
  }

  public async execute(
    options: ExecuteOptions,
    client: Web3ApiClient
  ): Promise<ExecuteResult> {
    const { module, method, input, results } = options;
    const resolvers = this._plugin.getResolvers();

    const root: "Query" | "Mutation" =
      module === "query" ? "Query" : "Mutation";

    if (!resolvers[root][method]) {
      return {
        result: { },
        error: new Error(
        `Web3API method not found in plugin's resolvers.` +
        `Operation: ${root}\nMethod: ${method}\nURI: ${this._uri}\nPlugin Resolvers: ${resolvers}`
        )
      };
    }

    const result = await resolvers[root][method](input, client);

    if (results) {
      return {
        result: filterExecuteResult(result, results)
      }
    } else {
      return { result }
    }
  }
}
