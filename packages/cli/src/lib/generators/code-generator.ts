import { BuildConfig } from "../Compiler";
import { SchemaComposer } from "../SchemaComposer";

export const generateCode = async (
  templateFile: string,
  config: BuildConfig
): Promise<boolean> => {
  const schemaComposer = new SchemaComposer(config);
  const manifest = await schemaComposer.loadManifest();
  const composedManifest = await schemaComposer.composeSchemas(manifest);

  console.log(composedManifest);
  return true;
};
