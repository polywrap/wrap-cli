import { Uri } from "@polywrap/core-js";

export interface InterfaceImplementations<TUri extends Uri | string = string> {
  interface: TUri;
  implementations: TUri[];
}
