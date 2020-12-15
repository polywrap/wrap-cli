// TODO: auto-generate this from "core-apis/uri-resolver/schema.graphql"
import {
  Uri,
  Client
} from "../";

export const Query = {
  supportedUriAuthority: (client: Client, api: Uri, authority: string) => (
    client.query<{ supportedUriAuthority: boolean }, { authority: string }>({
      uri: api,
      query: `query {
        supportedUriAuthority(
          authority: $authority
        )
      }`,
      variables: {
        authority
      }
    })
  ),
  tryResolveUriPath: (client: Client, api: Uri, path: string) => (
    client.query<{
      tryResolveUriPath: {
        uri?: string,
        manifest?: string
      }
    }, {
      path: string
    }>({
      uri: api,
      query: `query {
        tryResolveUriPath(
          path: $path
        ) { uri, manifest }
      }`,
      variables: {
        path
      }
    })
  )
}
