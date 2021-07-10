import { Uri, UriRedirect, InterfaceImplementations } from "../types";
import { applyRedirects } from "./apply-redirects";

import { Tracer } from "@web3api/tracing-js";

export const getImplementations = Tracer.traceFunc(
  "core: getImplementations",
  (
    apiInterfaceUri: Uri,
    redirects: readonly UriRedirect<Uri>[],
    interfaces: readonly InterfaceImplementations<Uri>[]
  ): Uri[] => {
    const result: Uri[] = [];

    const addUniqueResult = (uri: Uri) => {
      // If the URI hasn't been added already
      if (result.findIndex((i) => Uri.equals(i, uri)) === -1) {
        result.push(uri);
      }
    };

    const addAllImplementationsFromImplementationsArray = (
      implementationsArray: readonly InterfaceImplementations<Uri>[],
      apiInterfaceUri: Uri
    ) => {
      for (const interfaceImplementations of implementationsArray) {
        const fullyResolvedUri = applyRedirects(
          interfaceImplementations.interface,
          redirects
        );

        if (Uri.equals(fullyResolvedUri, apiInterfaceUri)) {
          for (const implementation of interfaceImplementations.implementations) {
            addUniqueResult(implementation);
          }
        }
      }
    };

    const finalRedirectedApiInterface = applyRedirects(
      apiInterfaceUri,
      redirects
    );

    addAllImplementationsFromImplementationsArray(
      interfaces,
      finalRedirectedApiInterface
    );

    return result;
  }
);
