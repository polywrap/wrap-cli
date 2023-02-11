import {
  Args_parse,
  Args_stringify,
  Args_stringifyObject,
  Args_methodJSON,
  ModuleBase
} from "./wrap";
import { JSON } from "@polywrap/wasm-as";

export class Module extends ModuleBase {
  parse(args: Args_parse): JSON.Value {
    return JSON.parse(args.value);
  }

  stringify(args: Args_stringify): string {
    let str = "";
    for (let i = 0; i < args.values.length; ++i) {
      const value = args.values[i];
      str += value.stringify();
    }
    return str;
  }

  stringifyObject(args: Args_stringifyObject): string {
    let str = "";
    str += args.object.jsonA.stringify();
    str += args.object.jsonB.stringify();
    return str;
  }

  methodJSON(args: Args_methodJSON): JSON.Value {
    const result = JSON.Value.Object();
    result.set("valueA", JSON.from(args.valueA));
    result.set("valueB", JSON.from(args.valueB));
    result.set("valueC", JSON.from(args.valueC));
  
    return result;
  }
}
