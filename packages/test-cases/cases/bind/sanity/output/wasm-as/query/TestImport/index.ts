import {
  w3_getImplementations
} from "@web3api/wasm-as";

export class TestImport {
  static uri: string = "testimport.uri.eth"

  public static getImplementations(): string[] {
    return w3_getImplementations(this.uri);
  }
}