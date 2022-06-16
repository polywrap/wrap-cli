import {
  w3_getImplementations
} from "@web3api/wasm-as";

export class Interface {
  static uri: string = "w3://ens/interface.eth"

  public static getImplementations(): string[] {
    return w3_getImplementations(this.uri);
  }
}