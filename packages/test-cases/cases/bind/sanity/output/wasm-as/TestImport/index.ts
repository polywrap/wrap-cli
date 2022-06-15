import {
  w3_getImplementations
} from "@polywrap/wasm-as";

export class TestImport {
  static uri: string = "testimport.uri.eth"

  public static getImplementations(): string[] {
    return w3_getImplementations(this.uri);
  }
}