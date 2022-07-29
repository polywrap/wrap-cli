import {
  ObjectDefinition,
  AnyDefinition,
} from "@polywrap/wrap-manifest-types-js";

export function checkDuplicateEnvProperties(
  envType: ObjectDefinition,
  envProperties: AnyDefinition[]
): void {
  const envPropertiesSet = new Set(
    envProperties.map((envProperty) => envProperty.name)
  );
  if (envType.properties) {
    for (const specificProperty of envType.properties) {
      if (envPropertiesSet.has(specificProperty.name)) {
        throw new Error(
          `Type '${envType.type}' contains duplicate property '${specificProperty.name}' of type 'Env'`
        );
      }
    }
  }
}
