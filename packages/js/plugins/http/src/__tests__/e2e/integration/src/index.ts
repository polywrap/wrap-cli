import {
  HTTP_Module,
  HTTP_Response,
  Args_get,
  Args_post,
} from "./wrap";

export function get(args: Args_get): HTTP_Response | null {
  return HTTP_Module.get({
    url: args.url,
    request: args.request
  }).unwrap();
}

export function post(args: Args_post): HTTP_Response | null {
  return HTTP_Module.post({
    url: args.url,
    request: args.request
  }).unwrap();
}
