import { Client, Module, Input_querySubgraph, HTTP_Query } from "./w3-man";
import { RequestData, RequestError } from "./types";

export interface QueryConfig extends Record<string, unknown> {
  provider: string;
}

export class Query extends Module<QueryConfig> {
  public async querySubgraph(
    input: Input_querySubgraph,
    client: Client
  ): Promise<string> {
    const { subgraphAuthor, subgraphName, query } = input;
    const { data, error } = await HTTP_Query.post(
      {
        url: `${this.config.provider}/subgraphs/name/${subgraphAuthor}/${subgraphName}`,
        request: {
          body: JSON.stringify({
            query,
          }),
          responseType: "TEXT",
        },
      },
      client
    );

    if (error) {
      throw new Error(`GraphNodePlugin: errors encountered. Error: ${error}`);
    }

    if (!data) {
      throw new Error(`GraphNodePlugin: data is undefined.`);
    }

    if (!data.body) {
      throw Error(`GraphNodePlugin: body is undefined.`);
    }

    const responseJson = JSON.parse(data.body) as RequestError | RequestData;

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
