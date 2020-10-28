export type TargetLanguage = "wasm-as";

export { buildSchema, Schema } from "./schema"
export { generateCode, OutputDirectory, OutputEntry } from "./codegen";
export { validateSchema, BaseTypes } from "./validation";
