// TODO: auto-generate this from "core-apis/uri-resolver/schema.graphql"
import {
  Uri,
  Client
} from "../";

export const Query = {
  supportedScheme: (client: Client, api: Uri, scheme: string) => (
    client.query<{ supportedScheme: boolean }, { scheme: string }>({
      uri: api,
      query: `query {
        supportedScheme(
          scheme: $scheme
        )
      }`,
      variables: {
        scheme
      }
    })
  ),
  tryResolveUri: (client: Client, api: Uri, uri: Uri) => (
    client.query<{
      uri?: string,
      manifest?: string
    }, {
      uri: string
    }>({
      uri: api,
      query: `query {
        tryResolveUri(
          uri: $uri
        ) { uri, manifest }
      }`,
      variables: {
        uri: uri.uri
      }
    })
  )
}
