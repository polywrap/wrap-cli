import {
  ExecuteOptions,
  ExecuteResult,
  Web3Api
} from "./";
import { filterExecuteResult } from "./filter-result";
import {
  Uri,
  Web3ApiClient,
  Web3ApiPlugin
} from "../";

export class PluginWeb3Api extends Web3Api {

  private _instance: Web3ApiPlugin | undefined;

  constructor(
    uri: Uri,
    private _plugin: () => Web3ApiPlugin
  ) {
    super(uri);
  }

  private getInstance(): Web3ApiPlugin {
    return this._instance || this._plugin();
  }

  public async execute(
    options: ExecuteOptions,
    client: Web3ApiClient
  ): Promise<ExecuteResult> {
    const { module, method, input, results } = options;
    const resolvers = this.getInstance().getQueryResolvers(client);

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
