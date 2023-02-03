import {
  Uri,
  InterfaceImplementations,
  CoreClient,
  WrapError,
  WrapErrorCode,
} from "../types";
import { IUriResolutionContext } from "../uri-resolution";
import { applyResolution } from "./applyResolution";

import { Result, ResultErr, ResultOk } from "@polywrap/result";

export const getImplementations = async (
  wrapperInterfaceUri: Uri,
  interfaces: readonly InterfaceImplementations[],
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
    implementationsArray: readonly InterfaceImplementations[],
    wrapperInterfaceUri: Uri
  ): Promise<Result<undefined, WrapError>> => {
    for (const interfaceImplementations of implementationsArray) {
      let fullyResolvedUri: Uri;
      if (client) {
        const redirectsResult = await applyResolution(
          interfaceImplementations.interface,
          client,
          resolutionContext
        );
        if (!redirectsResult.ok) {
          const error = new WrapError("Failed to resolve redirects", {
            uri: interfaceImplementations.interface.uri,
            code: WrapErrorCode.CLIENT_GET_IMPLEMENTATIONS_ERROR,
            cause: redirectsResult.error,
          });
          return ResultErr(error);
        }
        fullyResolvedUri = redirectsResult.value;
      } else {
        fullyResolvedUri = interfaceImplementations.interface;
      }

      if (Uri.equals(fullyResolvedUri, wrapperInterfaceUri)) {
        for (const implementation of interfaceImplementations.implementations) {
          addUniqueResult(implementation);
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
