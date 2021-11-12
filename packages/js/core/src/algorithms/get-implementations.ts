import { Uri, UriRedirect, InterfaceImplementations } from "../types";
import { applyRedirects } from "./apply-redirects";

import { Tracer } from "@web3api/tracing-js";

export const getImplementations = Tracer.traceFunc(
  "core: getImplementations",
  (
    apiInterfaceUri: Uri,
    interfaces: readonly InterfaceImplementations<Uri>[],
    redirects?: readonly UriRedirect<Uri>[]
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
        const fullyResolvedUri = redirects
          ? applyRedirects(interfaceImplementations.interface, redirects)
          : interfaceImplementations.interface;

        if (Uri.equals(fullyResolvedUri, apiInterfaceUri)) {
          for (const implementation of interfaceImplementations.implementations) {
            addUniqueResult(implementation);
          }
        }
      }
    };

    let finalUri = apiInterfaceUri;

    if (redirects) {
      finalUri = applyRedirects(apiInterfaceUri, redirects);
    }

    addAllImplementationsFromImplementationsArray(interfaces, finalUri);

    return result;
  }
);
