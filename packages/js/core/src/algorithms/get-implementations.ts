import {
  Uri,
  CoreClient,
  WrapError,
  WrapErrorCode,
  ReadonlyUriMap,
} from "../types";
import { IUriResolutionContext } from "../uri-resolution";
import { applyResolution } from "./applyResolution";

import { Result, ResultErr, ResultOk } from "@polywrap/result";

export const getImplementations = async (
  wrapperInterfaceUri: Uri,
  interfaces: ReadonlyUriMap<readonly Uri[]>,
  client?: CoreClient,
  resolutionContext?: IUriResolutionContext
): Promise<Result<Uri[], WrapError>> => {
  const result: Uri[] = [];

  const addUniqueResult = (uri: Uri) => {
    // If the URI hasn't been added already
    if (result.findIndex((i) => Uri.equals(i, uri)) === -1) {
      result.push(uri);
    }
  };

  const addAllImplementationsFromImplementationsArray = async (
    impls: ReadonlyUriMap<readonly Uri[]>,
    wrapperInterfaceUri: Uri
  ): Promise<Result<undefined, WrapError>> => {
    for (const impl of impls.keys()) {
      let fullyResolvedUri: Uri;
      if (client) {
        const redirectsResult = await applyResolution(
          impl,
          client,
          resolutionContext
        );
        if (!redirectsResult.ok) {
          const error = new WrapError("Failed to resolve redirects", {
            uri: impl.uri,
            code: WrapErrorCode.CLIENT_GET_IMPLEMENTATIONS_ERROR,
            cause: redirectsResult.error,
          });
          return ResultErr(error);
        }
        fullyResolvedUri = redirectsResult.value;
      } else {
        fullyResolvedUri = impl;
      }

      if (Uri.equals(fullyResolvedUri, wrapperInterfaceUri)) {
        const implementations = impls.get(impl);
        if (implementations) {
          for (const implementation of implementations) {
            addUniqueResult(Uri.from(implementation));
          }
        }
      }
    }
    return ResultOk(undefined);
  };

  let finalUri = wrapperInterfaceUri;

  if (client) {
    const redirectsResult = await applyResolution(
      wrapperInterfaceUri,
      client,
      resolutionContext
    );
    if (!redirectsResult.ok) {
      const error = new WrapError("Failed to resolve redirects", {
        uri: wrapperInterfaceUri.uri,
        code: WrapErrorCode.CLIENT_GET_IMPLEMENTATIONS_ERROR,
        cause: redirectsResult.error,
      });
      return ResultErr(error);
    }
    finalUri = redirectsResult.value;
  }

  const addAllImp = await addAllImplementationsFromImplementationsArray(
    interfaces,
    finalUri
  );

  return addAllImp.ok ? ResultOk(result) : addAllImp;
};
