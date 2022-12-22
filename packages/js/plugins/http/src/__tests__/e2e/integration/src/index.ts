import {
  HTTP_Module,
  HTTP_Response,
  Args_get,
  Args_post,
  IModule
} from "./wrap";

export class Module extends IModule {
  get(args: Args_get): HTTP_Response | null {
    return HTTP_Module.get({
      url: args.url,
      request: args.request
    }).unwrap();
  }

  post(args: Args_post): HTTP_Response | null {
    return HTTP_Module.post({
      url: args.url,
      request: args.request
    }).unwrap();
  }
}
