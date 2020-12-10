// TODO: auto-generate this from "core-apis/api-resolver/schema.graphql"
import {
  Uri,
  QueryClient
} from "../";

export const Query = {
  getFile: (client: QueryClient, uri: Uri, path: string) => (
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
