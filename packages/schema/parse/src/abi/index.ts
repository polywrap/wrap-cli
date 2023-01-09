import { Abi } from "../definitions";

export * from "@polywrap/wrap-manifest-types-js";
export * from "./definitions";
export * from "./env";
export * from "./utils";

export function createAbi(): Abi {
  return {
    version: "0.2"
  };
}
