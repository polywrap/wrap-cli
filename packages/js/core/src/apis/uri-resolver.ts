// TODO: auto-generate this from "core-apis/uri-resolver/schema.graphql"
import {
  Uri,
  QueryClient
} from "../";

export const Query = {
  supportedScheme: (client: QueryClient, uri: Uri, protocol: string) => (
    client.query<{ supportedScheme: boolean }, { protocol: string }>({
      uri,
      query: `query {
        supportedScheme(
          protocol: $protocol
        )
      }`,
      variables: {
        protocol
      }
    })
  ),
  tryResolveUri: (client: QueryClient, uri: Uri) => (
    client.query<{
      uri?: string,
      manifest?: string
    }, {
      uri: string
    }>({
      uri,
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
