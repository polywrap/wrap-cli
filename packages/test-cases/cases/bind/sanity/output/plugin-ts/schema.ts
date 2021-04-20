import { Client, PluginModule } from "@web3api/core-js"

export interface QueryModule extends PluginModule {
  queryMethod: (
    input: Input_queryMethod
  ) => number;
}

export interface Input_queryMethod {
  str: string;
  optStr?: string;
  en: CustomEnum;
  optEnum?: CustomEnum;
  enumArray: CustomEnum[];
  optEnumArray?: (CustomEnum | undefined)[];
}
