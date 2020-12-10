// TODO: auto-generate this from "core-apis/api-resolver/schema.graphql"
import {
  Uri,
  Web3ApiClient
} from "../..";

export const Query = {
  getFile: (client: Web3ApiClient, uri: Uri, path: string) => (
    client.query<{ getFile: ArrayBuffer }, { path: string }>({
      uri,
      query: `query {
        getFile(
          path: $path
        )
      }`,
      variables: {
        path
      }
    })
  )
}
