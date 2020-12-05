// api-resolver.core.web3api.eth

// TODO: auto-generate this from a standard interface
export const query = (path: string) => `query {
  getFile(
    path: "${path}"
  ) { bytes }
}`;

export interface Result {
  bytes?: ArrayBuffer;
}
