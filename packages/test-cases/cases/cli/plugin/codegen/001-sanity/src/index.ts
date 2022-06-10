import { Client } from "@web3api/core-js";
import {
  Module,
  Object,
  Input_method
} from "./w3";

export interface MainConfig extends Record<string, unknown> {

}

export class Main extends Module<MainConfig> {

  public methodOne(_input: Input_method, _client: Client): Object {
    return {
      u: 0,
      array: [true],
      bytes: null,
    };
  }

  public methodTwo(_input: Input_method, _client: Client): string {
    return "foo";
  }
}