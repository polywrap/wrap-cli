import {
  wrap_getImplementations
} from "@polywrap/wasm-as";

export class TestImport {
  static uri: string = "testimport.uri.eth"

  public static getImplementations(): string[] {
    return wrap_getImplementations(this.uri);
  }
}