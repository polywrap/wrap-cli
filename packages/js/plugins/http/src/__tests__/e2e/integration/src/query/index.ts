import {
  HTTP_Query,
  HTTP_Response,
  Input_get,
  Input_post,
} from "./w3";

export function get(input: Input_get): HTTP_Response | null {
  return HTTP_Query.get({
    url: input.url,
    request: input.request
  }).unwrap();
}

export function post(input: Input_post): HTTP_Response | null {
  return HTTP_Query.post({
    url: input.url,
    request: input.request
  }).unwrap();
}
