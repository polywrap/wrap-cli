import {
  Uri,
  QueryClient
} from ".";

export interface InvokeApiOptions {
  module: "query" | "mutation";
  method: string;
  input: Record<string, any>;
  results?: Record<string, any>;
}

export interface InvokeApiResult<
  TData = Record<string, unknown>
> {
  data?: TData | null;
  errors?: Error[];
}

export abstract class Api {

  constructor(protected _uri: Uri) { }

  public async abstract invoke<
    TData = Record<string, unknown>
  >(
    options: InvokeApiOptions,
    client: QueryClient
  ): Promise<InvokeApiResult<TData>>;
}

export class ApiCache extends Map<string, Api> { }
