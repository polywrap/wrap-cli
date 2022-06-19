// indicates what "sections" are imported--i.e. moduleTypes, objectTypes, enumTypes
import { LOCAL_NAMESPACE } from "../docusaurus";

import { TypeInfo } from "@polywrap/schema-parse";

interface NamespaceSection {
  namespace: string;
  sections: { section: string }[];
}
// used in mustache template sidebars-js.mustache
interface NamespaceSections {
  namespaces: NamespaceSection[];
}

export function createNamespaceSections(typeInfo: TypeInfo): NamespaceSections {
  const nsMap: Map<string, string[]> = new Map<string, string[]>();

  if (
    typeInfo.moduleType ||
    typeInfo.objectTypes.length > 0 ||
    typeInfo.enumTypes.length > 0
  ) {
    nsMap.set(LOCAL_NAMESPACE, []);
    if (typeInfo.moduleType) {
      nsMap.get(LOCAL_NAMESPACE)?.push(typeInfo.moduleType.type.toLowerCase());
    }
    if (typeInfo.objectTypes.length > 0) {
      nsMap.get(LOCAL_NAMESPACE)?.push("objects");
    }
    if (typeInfo.enumTypes.length > 0) {
      nsMap.get(LOCAL_NAMESPACE)?.push("enums");
    }
  }

  for (const module of typeInfo.importedModuleTypes) {
    const moduleType = module.type.split("_")[1].toLowerCase();
    if (!nsMap.has(module.namespace)) {
      nsMap.set(module.namespace, [moduleType]);
      continue;
    }
    nsMap.get(module.namespace)?.push(moduleType);
  }
  for (const objectType of typeInfo.importedObjectTypes) {
    const namespace = objectType.namespace;
    if (!nsMap.has(namespace)) {
      nsMap.set(namespace, ["objects"]);
      continue;
    }
    const arr = nsMap.get(namespace);
    if (arr && !arr.includes("objects")) {
      arr.push("objects");
    }
  }
  for (const enumType of typeInfo.importedEnumTypes) {
    const namespace = enumType.namespace;
    if (!nsMap.has(namespace)) {
      nsMap.set(namespace, ["enums"]);
      continue;
    }
    const arr = nsMap.get(namespace);
    if (arr && !arr.includes("enums")) {
      arr.push("enums");
    }
  }

  const namespaces: NamespaceSection[] = [];
  nsMap.forEach((val: string[], key: string) => {
    namespaces.push({
      namespace: key,
      sections: val.map((section: string) => ({ section })),
    });
  });
  return { namespaces };
}
