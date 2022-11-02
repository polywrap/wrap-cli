import { Uri, InterfaceImplementations, CoreClient } from "../types";

import { Tracer } from "@polywrap/tracing-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";
import { IUriResolutionContext } from "../uri-resolution";
import { GetImplementationsError } from "./GetImplementationsError";

const applyRedirects = async (
  uri: Uri,
  client: CoreClient,
  resolutionContext?: IUriResolutionContext
): Promise<Result<Uri, unknown>> => {
  const result = await client.tryResolveUri({ uri, resolutionContext });

  if (!result.ok) {
    return result;
  }

  return ResultOk(result.value.uri);
};

export const getImplementations = Tracer.traceFunc(
  "core: getImplementations",
  async (
    wrapperInterfaceUri: Uri,
    interfaces: readonly InterfaceImplementations<Uri>[],
    client?: CoreClient,
    resolutionContext?: IUriResolutionContext
  ): Promise<Result<Uri[], GetImplementationsError>> => {
    const result: Uri[] = [];

    const addUniqueResult = (uri: Uri) => {
      // If the URI hasn't been added already
      if (result.findIndex((i) => Uri.equals(i, uri)) === -1) {
        result.push(uri);
      }
    };

    const addAllImplementationsFromImplementationsArray = async (
      implementationsArray: readonly InterfaceImplementations<Uri>[],
      wrapperInterfaceUri: Uri
    ): Promise<Result<undefined, unknown>> => {
      for (const interfaceImplementations of implementationsArray) {
        let fullyResolvedUri: Uri;
        if (client) {
          const redirectsResult = await applyRedirects(
            interfaceImplementations.interface,
            client,
            resolutionContext
          );
          if (!redirectsResult.ok) {
            return redirectsResult;
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
      const redirectsResult = await applyRedirects(
        wrapperInterfaceUri,
        client,
        resolutionContext
      );
      if (!redirectsResult.ok) {
        return ResultErr(new GetImplementationsError(redirectsResult.error));
      }
      finalUri = redirectsResult.value;
    }

    const addAllImp = await addAllImplementationsFromImplementationsArray(
      interfaces,
      finalUri
    );

    return addAllImp.ok
      ? ResultOk(result)
      : ResultErr(new GetImplementationsError(addAllImp.error));
  }
);
