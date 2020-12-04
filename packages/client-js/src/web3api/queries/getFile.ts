// TODO: name this abstract interface... is it a "package-resolver"?
// TODO: auto-generate this from a standard interface
export const query = (path: string) => `query {
  getFile(
    path: "${path}"
  ) { bytes }
}`;

export interface Result {
  bytes?: ArrayBuffer;
}
