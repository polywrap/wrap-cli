import {
  HTTP_Module,
  HTTP_Response,
  Input_get,
  Input_post,
} from "./wrap";

export function get(input: Input_get): HTTP_Response | null {
  return HTTP_Module.get({
    url: input.url,
    request: input.request
  }).unwrap();
}

export function post(input: Input_post): HTTP_Response | null {
  return HTTP_Module.post({
    url: input.url,
    request: input.request
  }).unwrap();
}
