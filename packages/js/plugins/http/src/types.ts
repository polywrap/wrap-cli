// TODO: Generate this from the schema.graphql file
// https://github.com/Web3-API/prototype/issues/101

export class Header {
  key: string;
  value: string;
}

export class UrlParam {
  key: string;
  value: string;
}

// even though in schema enum is used, this will be converted to string
// so this is a reason to define ResponseType as string here
// export type ResponseType = "TEXT" | "BINARY";

export enum ResponseType {
  TEXT, 
  BINARY
}

export class Request {
  headers?: Header[];
  urlParams?: UrlParam[];
  responseType: ResponseType;
  body?: string;
}

export class Response {
  status: number;
  statusText: string;
  headers: Header[];
  body: string;
}
