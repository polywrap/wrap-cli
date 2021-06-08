import { Uri, UriRedirect, UriInterfaceImplementations } from "../types";

import { Tracer } from "@web3api/tracing-js";
import { applyRedirects } from "./apply-redirects";

export const getImplementations = Tracer.traceFunc(
  "core: getImplementations",
  (apiInterfaceUri: Uri, redirects: readonly UriRedirect<Uri>[], implementations: readonly UriInterfaceImplementations<Uri>[]): Uri[] => {
    const result: Uri[] = [];

    const addUniqueResult = (uri: Uri) => {
      // If the URI hasn't been added already
      if (result.findIndex((i) => Uri.equals(i, uri)) === -1) {
        result.push(uri);
      }
    };

    const addAllImplementationsFromPluginRedirects = (redirects: readonly UriRedirect<Uri>[], abstractApi: Uri) => {
      for (const redirect of redirects) {
        // Plugin implemented check
        if (!Uri.isUri(redirect.to)) {
          const { implemented } = redirect.to.manifest;
          const implementedApi =
            implemented.findIndex((uri) => Uri.equals(uri, apiInterfaceUri)) > -1;
    
          if (implementedApi) {
            addUniqueResult(redirect.from);
          }
        }
      }
    };


    const addAllImplementationsFromImplementationsArray = (implementationsArray: readonly UriInterfaceImplementations<Uri>[], abstractApi: Uri) => {
      for (const interfaceImplementations of implementationsArray) {
        const fullyResolvedUri = applyRedirects(interfaceImplementations.interface, redirects);
    
        if(Uri.equals(fullyResolvedUri, apiInterfaceUri)) {
          for(const implementation of interfaceImplementations.implementations) {
            addUniqueResult(implementation);
          }
        }
      }
    };

    const fullyResolvedApiInterface = applyRedirects(apiInterfaceUri, redirects);

    addAllImplementationsFromPluginRedirects(redirects, fullyResolvedApiInterface);
    addAllImplementationsFromImplementationsArray(implementations, fullyResolvedApiInterface);

    return result;
  }
);