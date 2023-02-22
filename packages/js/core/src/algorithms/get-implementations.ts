import {
  Uri,
  CoreClient,
  WrapError,
  WrapErrorCode,
  InterfaceImpls,
} from "../types";
import { IUriResolutionContext } from "../uri-resolution";
import { applyResolution } from "./applyResolution";

import { Result, ResultErr, ResultOk } from "@polywrap/result";

export const getImplementations = async (
  wrapperInterfaceUri: Uri,
  interfaces: InterfaceImpls,
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
    impls: InterfaceImpls,
    wrapperInterfaceUri: Uri
  ): Promise<Result<undefined, WrapError>> => {
    for (const impl in impls) {
      let fullyResolvedUri: Uri;
      let interfaceUri = Uri.from(impl);
      if (client) {
        const redirectsResult = await applyResolution(
          interfaceUri,
          client,
          resolutionContext
        );
        if (!redirectsResult.ok) {
          const error = new WrapError("Failed to resolve redirects", {
            uri: impl,
            code: WrapErrorCode.CLIENT_GET_IMPLEMENTATIONS_ERROR,
            cause: redirectsResult.error,
          });
          return ResultErr(error);
        }
        fullyResolvedUri = redirectsResult.value;
      } else {
        fullyResolvedUri = interfaceUri;
      }

      if (Uri.equals(fullyResolvedUri, wrapperInterfaceUri)) {
        for (const implementation of impls[impl]) {
          addUniqueResult(Uri.from(implementation));
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
