import { intlMsg } from "../intl";

import {
  Env,
  InterfaceImplementations,
  Uri,
  IUriRedirect,
} from "@polywrap/client-js";
import { CustomClientConfig } from "@polywrap/client-config-builder-js";

export function validateRedirects<TUri extends Uri | string>(
  redirects: IUriRedirect<TUri>[]
): void {
  if (!Array.isArray(redirects)) {
    throw new Error(intlMsg.commands_run_error_redirectsExportNotArray());
  }

  // Ensure each redirect in the array is valid
  for (let i = 0; i < redirects.length; ++i) {
    const redirect = redirects[i];

    if (typeof redirect !== "object" || !redirect.from || !redirect.to) {
      throw new Error(
        intlMsg.commands_run_error_redirectsItemNotValid({
          index: i.toString(),
        })
      );
    } else if (typeof redirect.from !== "string") {
      throw new Error(
        intlMsg.commands_run_error_redirectsItemFromNotString({
          index: i.toString(),
        })
      );
    } else if (typeof redirect.to !== "string") {
      throw new Error(
        intlMsg.commands_run_error_redirectsItemToNotStringOrObject({
          index: i.toString(),
        })
      );
    }
  }
}

export function validateInterfaces<TUri extends Uri | string = string>(
  interfaces: InterfaceImplementations<TUri>[]
): void {
  if (!Array.isArray(interfaces)) {
    throw new Error(intlMsg.commands_run_error_interfacesExportNotArray());
  }
  // Ensure each interface in the array is valid
  for (let i = 0; i < interfaces.length; ++i) {
    const interfaceImplementations = interfaces[i];
    if (typeof interfaceImplementations !== "object") {
      throw new Error(
        intlMsg.commands_run_error_interfacesItemNotObject({
          index: i.toString(),
        })
      );
    } else if (typeof interfaceImplementations.interface !== "string") {
      throw new Error(
        intlMsg.commands_run_error_interfacesItemInterfaceNotString({
          index: i.toString(),
        })
      );
    } else if (!Array.isArray(interfaceImplementations.implementations)) {
      throw new Error(
        intlMsg.commands_run_error_interfacesItemImplementationsNotArray({
          index: i.toString(),
        })
      );
    } else if (interfaceImplementations.implementations.length === 0) {
      throw new Error(
        intlMsg.commands_run_error_interfacesItemImplementationsEmpty({
          index: i.toString(),
        })
      );
    }
    for (let j = 0; j < interfaceImplementations.implementations.length; ++j) {
      const implementation = interfaceImplementations.implementations[j];
      if (typeof implementation !== "string") {
        throw new Error(
          intlMsg.commands_run_error_interfacesItemImplementationsItemNotString(
            {
              index: i.toString(),
              implementationIndex: j.toString(),
            }
          )
        );
      }
    }
  }
}

export function validateEnvs<TUri extends Uri | string = string>(
  envs: Env<TUri>[]
): void {
  if (!Array.isArray(envs)) {
    throw new Error(intlMsg.commands_run_error_envsExportNotArray());
  }
  for (let i = 0; i < envs.length; ++i) {
    const env = envs[i];
    if (typeof env !== "object") {
      throw new Error(
        intlMsg.commands_run_error_envsItemNotObject({
          index: i.toString(),
        })
      );
    } else if (typeof env.uri !== "string") {
      throw new Error(
        intlMsg.commands_run_error_envsItemUriNotString({
          index: i.toString(),
        })
      );
    } else if (!env.env && typeof env.env !== "object") {
      throw new Error(
        intlMsg.commands_run_error_envsItemModuleNotObject({
          index: i.toString(),
        })
      );
    }
  }
}

export function validateClientConfig(
  config: Partial<CustomClientConfig<Uri | string>>
): void {
  if (!config || typeof config !== "object") {
    throw new Error(intlMsg.commands_run_error_clientConfigNotObject());
  }
  if (config.envs) validateEnvs(config.envs);
  if (config.interfaces) validateInterfaces(config.interfaces);
  if (config.redirects) validateRedirects(config.redirects);
}
