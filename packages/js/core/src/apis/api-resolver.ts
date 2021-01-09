// TODO: auto-generate this from "core-apis/api-resolver/schema.graphql"
import {
  Uri,
  Client
} from "../";

export const Query = {
  tryResolveUri: (client: Client, api: Uri, uri: Uri) => (
    client.invoke<{
      uri?: string,
      manifest?: string
    }>({
      uri: api,
      module: "query",
      method: `tryResolveUri`,
      input: {
        authority: uri.authority,
        path: uri.path
      }
    })
  ),
  getFile: (client: Client, api: Uri, path: string) => (
    client.invoke<ArrayBuffer>({
      uri: api,
      module: "query",
      method: "getFile",
      input: {
        path
      }
    })
  )
}
