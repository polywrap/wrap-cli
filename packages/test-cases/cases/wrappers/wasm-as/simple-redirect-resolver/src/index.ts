import {
  Args_getFile,
  Args_tryResolveUri,
  UriResolver_MaybeUriOrManifest,
} from "./wrap";

export function tryResolveUri(
  args: Args_tryResolveUri
): UriResolver_MaybeUriOrManifest {
  if (args.authority != "simple-redirect") {
    return {
      uri: "wrap://" + args.authority + "/" + args.path,
      manifest: null,
    };
  }

  return {
    uri: "wrap://simple/" + args.path,
    manifest: null,
  };
}

export function getFile(args: Args_getFile): ArrayBuffer | null {
  return null;
}
