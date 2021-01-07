// TODO: auto-generate this from "core-apis/api-resolver/schema.graphql"
import {
  Uri,
  Client
} from "../";

export const Query = {
  getFile: (client: Client, uri: Uri, path: string) => (
    client.invoke<ArrayBuffer>({
      uri,
      module: "query",
      method: "getFile",
      input: {
        path
      }
    })
  )
}
