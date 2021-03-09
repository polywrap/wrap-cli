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
