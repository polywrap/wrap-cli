import Handlebars from "handlebars";
import { isKeyword } from "./types";
import { AssemblyscriptWasmInitRenderer } from "./renderers/WasmInitialValuesRenderer";
import { MsgPackRenderer } from "./renderers/MsgPackRenderer";
import { AssemblyscriptWasmRenderer } from "./renderers/WasmRenderer";

const msgPackRenderer = new MsgPackRenderer()
const wasmRenderer = new AssemblyscriptWasmRenderer();
const wasmInitValueRenderer = new AssemblyscriptWasmInitRenderer(wasmRenderer);

Handlebars.registerHelper("toMsgPack", msgPackRenderer.renderAnyType)
Handlebars.registerHelper("toWasmInit", wasmInitValueRenderer.renderAnyType)
Handlebars.registerHelper("toWasm", wasmRenderer.renderAnyType)
// check if any of the keywords match the property name;
// if there's a match, insert `_` at the beginning of the property name.
Handlebars.registerHelper("detectKeyword", (typeName: string) => {
  return isKeyword(typeName) ? `_${typeName}`: typeName
})