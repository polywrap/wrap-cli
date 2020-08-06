import { ResultObject, ASUtil, Imports } from "@assemblyscript/loader";

interface ASMarshalUtil {
  UINT8ARRAY_ID: number
}

export type ASCModule = ResultObject & { exports: ASUtil & ASMarshalUtil };

export type ASCImports = Imports;
