export const query = (uri: string) => `query {
  tryResolveUri(
    uri: "${uri}"
  ) { uri, manifest }
}`;

export interface Result {
  uri?: string,
  manifest?: string
}
