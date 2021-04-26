// TODO: generate types from the schema
// https://github.com/web3-api/monorepo/issues/101

export interface ResolveResult {
  cid: string;
  provider: string;
}

export interface Options {
  timeout?: number;
  provider?: string;
}
