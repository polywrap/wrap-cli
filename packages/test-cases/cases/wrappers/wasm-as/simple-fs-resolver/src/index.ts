import {
  Args_getFile,
  Args_tryResolveUri,
  UriResolver_MaybeUriOrManifest,
  IModule,
} from "./wrap";

export class Module extends IModule {
  tryResolveUri(
    args: Args_tryResolveUri
  ): UriResolver_MaybeUriOrManifest {
    if (args.authority != "simple") {
      return {
        uri: "wrap://" + args.authority + "/" + args.path,
        manifest: null,
      };
    }
  
    return {
      uri: "wrap://file/" + args.path,
      manifest: null,
    };
  }

  getFile(args: Args_getFile): ArrayBuffer | null {
    return null;
  }  
}