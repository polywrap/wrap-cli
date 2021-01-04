// TODO: auto-generate this from "core-apis/uri-resolver/schema.graphql"
import { Uri, Client, QueryApiResult } from "../";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Query = {
  supportedUriAuthority: (
    client: Client,
    api: Uri,
    authority: string
  ): Promise<
    QueryApiResult<{
      supportedUriAuthority: boolean;
    }>
  > =>
    client.query<{ supportedUriAuthority: boolean }, { authority: string }>({
      uri: api,
      query: `query {
        supportedUriAuthority(
          authority: $authority
        )
      }`,
      variables: {
        authority,
      },
    }),
  tryResolveUriPath: (
    client: Client,
    api: Uri,
    path: string
  ): Promise<
    QueryApiResult<{
      tryResolveUriPath: {
        uri?: string;
        manifest?: string;
      };
    }>
  > =>
    client.query<
      {
        tryResolveUriPath: {
          uri?: string;
          manifest?: string;
        };
      },
      {
        path: string;
      }
    >({
      uri: api,
      query: `query {
        tryResolveUriPath(
          path: $path
        ) { uri, manifest }
      }`,
      variables: {
        path,
      },
    }),
};
