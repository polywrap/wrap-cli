import { Uri, UriRedirect, InterfaceImplementations } from "../types";
import { applyRedirects } from "./apply-redirects";

import { Tracer } from "@polywrap/tracing-js";

export const getImplementations = Tracer.traceFunc(
  "core: getImplementations",
  (
    wrapperInterfaceUri: Uri,
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
      wrapperInterfaceUri: Uri
    ) => {
      for (const interfaceImplementations of implementationsArray) {
        const fullyResolvedUri = redirects
          ? applyRedirects(interfaceImplementations.interface, redirects)
          : interfaceImplementations.interface;

        if (Uri.equals(fullyResolvedUri, wrapperInterfaceUri)) {
          for (const implementation of interfaceImplementations.implementations) {
            addUniqueResult(implementation);
          }
        }
      }
    };

    let finalUri = wrapperInterfaceUri;

    if (redirects) {
      finalUri = applyRedirects(wrapperInterfaceUri, redirects);
    }

    addAllImplementationsFromImplementationsArray(interfaces, finalUri);

    return result;
  }
);
