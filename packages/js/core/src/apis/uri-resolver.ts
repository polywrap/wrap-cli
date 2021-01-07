// TODO: auto-generate this from "core-apis/uri-resolver/schema.graphql"
import {
  Uri,
  Client
} from "../";

export const Query = {
  supportedUriAuthority: (client: Client, api: Uri, authority: string) => (
    client.invoke<boolean>({
      uri: api,
      module: "query",
      method: `supportedUriAuthority`,
      input: {
        authority
      }
    })
  ),
  tryResolveUriPath: (client: Client, api: Uri, path: string) => (
    client.invoke<boolean>({
      uri: api,
      module: "query",
      method: `tryResolveUriPath`,
      input: {
        path
      }
    })
  )
}
