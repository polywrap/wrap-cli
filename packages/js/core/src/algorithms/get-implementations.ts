import {
  Uri,
  UriRedirect,
  InterfaceImplementations,
  WrapError,
  WrapErrorCode,
} from "../types";
import { applyRedirects } from "./apply-redirects";

import { Tracer } from "@polywrap/tracing-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export const getImplementations = Tracer.traceFunc(
  "core: getImplementations",
  (
    wrapperInterfaceUri: Uri,
    interfaces: readonly InterfaceImplementations<Uri>[],
    redirects?: readonly UriRedirect<Uri>[]
  ): Result<Uri[], WrapError> => {
    const result: Uri[] = [];

    const addUniqueResult = (uri: Uri) => {
      // If the URI hasn't been added already
      if (result.findIndex((i) => Uri.equals(i, uri)) === -1) {
        result.push(uri);
      }
    };

    const addAllImplementationsFromImplementationsArray = (
      implementationsArray: readonly InterfaceImplementations<Uri>[],
      wrapperInterfaceUri: Uri
    ): Result<undefined, WrapError> => {
      for (const interfaceImplementations of implementationsArray) {
        let fullyResolvedUri: Uri;
        if (redirects) {
          const redirectsResult = applyRedirects(
            interfaceImplementations.interface,
            redirects
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

    if (redirects) {
      const redirectsResult = applyRedirects(wrapperInterfaceUri, redirects);
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

    const addAllImp = addAllImplementationsFromImplementationsArray(
      interfaces,
      finalUri
    );

    return addAllImp.ok ? ResultOk(result) : addAllImp;
  }
);
