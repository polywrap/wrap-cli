
import { OutputDirectory, Schema } from "../../";
import * as TypePacking from "./type-packing";

export function generateBinding(schema: Schema): OutputDirectory {
  return {
    entries: [
      {
        type: "File",
        name: "type-packing.ts",
        data: TypePacking.render(schema)
      }
    ]
  }
}
