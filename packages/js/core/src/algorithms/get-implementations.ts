import { Uri, UriRedirect, InterfaceImplementations, PluginRegistration } from "../types";
import { applyRedirects } from "./apply-redirects";

import { Tracer } from "@web3api/tracing-js";

export const getImplementations = Tracer.traceFunc(
  "core: getImplementations",
  (
    apiInterfaceUri: Uri,
    redirects: readonly UriRedirect<Uri>[],
    plugins: readonly PluginRegistration<Uri>[],
    interfaceImplementationsList: readonly InterfaceImplementations<Uri>[]
  ): Uri[] => {
    const result: Uri[] = [];

    const addUniqueResult = (uri: Uri) => {
      // If the URI hasn't been added already
      if (result.findIndex((i) => Uri.equals(i, uri)) === -1) {
        result.push(uri);
      }
    };

    const addAllImplementationsFromPluginRedirects = (
      apiInterfaceUri: Uri
    ) => {
      for (const pluginRegistration of plugins) {
        const { implemented } = pluginRegistration.plugin.manifest;
        const implementedApi =
          implemented.findIndex((uri) => Uri.equals(uri, apiInterfaceUri)) > -1;

        if (implementedApi) {
          addUniqueResult(pluginRegistration.uri);
        }
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

    addAllImplementationsFromPluginRedirects(
      finalRedirectedApiInterface
    );
    addAllImplementationsFromImplementationsArray(
      interfaceImplementationsList,
      finalRedirectedApiInterface
    );

    return result;
  }
);
