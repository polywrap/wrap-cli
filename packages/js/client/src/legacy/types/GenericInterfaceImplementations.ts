import { Uri } from "@polywrap/core-js";

export interface GenericInterfaceImplementations<
  TUri extends Uri | string = string
> {
  interface: TUri;
  implementations: TUri[];
}
