// TODO: auto-generate this from "core-apis/api-resolver/schema.graphql"
import { Uri, Client } from "../";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Query = {
  getFile: (client: Client, uri: Uri, path: string): ReturnType<typeof client["query"]> =>
    client.query<{ getFile: ArrayBuffer }, { path: string }>({
      uri,
      query: `query {
        getFile(
          path: $path
        )
      }`,
      variables: {
        path,
      },
    }),
};
