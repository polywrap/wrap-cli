import { ExternalImportStatement, ImportStatement, LocalImportStatement, MODULE_NAME } from "@polywrap/schema-parse";
import { Abi, AnyType, EnumDef, FunctionDef, ImportRefType, ObjectDef, RefType } from "@polywrap/schema-parse/build/definitions";
import { AbiVisitor } from "./visitor";

interface LinkImportsAbiArgs {
  importStatements: (ExternalImportStatement | LocalImportStatement)[];
  abi: Abi;
  imports: Map<string, Abi>;
}

type DefsWithRefs = ObjectDef | FunctionDef;
type DefsThatCanBeReferenced = ObjectDef | EnumDef;
const KINDS_WITH_REFS = ["Object", "Function"] as const;
const REFERENCEABLE_KINDS = ["Object", "Enum"] as const;

const findReferencedDefintionByName = (abi: Abi, ref_name: string): DefsThatCanBeReferenced | undefined => {
  const object = abi.objects?.find((object) => object.name === ref_name);
  if (object) {
    return object;
  }

  const enumDef = abi.enums?.find((enumDef) => enumDef.name === ref_name);
  if (enumDef) {
    return enumDef;
  }

  return undefined;
}

const extractRefFromAnyType = (type: AnyType): RefType | ImportRefType | undefined => {
  switch (type.kind) {
    case "Ref":
    case "ImportRef":
      return type;
    case "Scalar":
      return undefined;
    case "Array":
      return extractRefFromAnyType(type.item.type);
    case "Map":
      return extractRefFromAnyType(type.value.type);
  }
}

const extractDefFromRef = (abi: Abi, ref: RefType | ImportRefType): DefsThatCanBeReferenced => {
  const name = ref.ref_name;
  const definition = findReferencedDefintionByName(abi, name);

  if (!definition) {
    throw new Error(`Found reference to '${name}'. But no definition found with this name.`)
  }

  if (REFERENCEABLE_KINDS.includes(definition.kind)) {
    throw new Error(`Found reference to '${name}'. But this is a '${definition.kind}' definition which can't be referenced.`)
  }

  return definition;
}

const extractReferencedDefs = (abi: Abi, defWithRefs: DefsWithRefs): DefsThatCanBeReferenced[] => {
  const extractRefsFromAnyType = (type: AnyType): DefsThatCanBeReferenced[] => {
    const dependencies: DefsThatCanBeReferenced[] = [];
    const ref = extractRefFromAnyType(type);

    if (ref) {
      const definition = extractDefFromRef(abi, ref);
      dependencies.push(definition);

      if (definition.kind in KINDS_WITH_REFS) {
        dependencies.push(...extractReferencedDefs(abi, definition as DefsWithRefs));
      }
    }

    return dependencies;
  }

  switch (defWithRefs.kind) {
    case "Object": {
      const dependencies: DefsThatCanBeReferenced[] = [];

      for (const property of defWithRefs.props) {
        dependencies.push(...extractRefsFromAnyType(property.type));
        // TODO: ImportRef handling
      };

      return dependencies;
    }
    case "Function": {
      let dependencies: DefsThatCanBeReferenced[] = [];

      for (const arg of defWithRefs.args) {
        dependencies.push(...extractRefsFromAnyType(arg.type));
      }
      dependencies.push(...extractRefsFromAnyType(defWithRefs.result.type));

      return dependencies;
    }
  }
}

const treeShakeImportedAbi = (importedAbi: Abi, importStatement: ImportStatement): Abi => {
  const treeShakenAbi: Abi = {
    version: "0.2"
  };

  const { importedTypes } = importStatement;

  const importedObjects = importedAbi?.objects?.filter((object) => importedTypes.includes(object.name)) ?? [];
  const importedEnums = importedAbi?.enums?.filter((enumDef) => importedTypes.includes(enumDef.name)) ?? [];
  const importedFunctions = (importedTypes.includes(MODULE_NAME) ? importedAbi?.functions : []) ?? []

  const refsFromObjects = importedObjects.flatMap((object) => extractReferencedDefs(importedAbi, object));
  const referencedEnumsFromObjects = refsFromObjects.filter((ref) => ref.kind === "Enum") as EnumDef[];
  const referencedObjectsFromObjects = refsFromObjects.filter((ref) => ref.kind === "Object") as ObjectDef[];

  const refsFromFunctions = importedFunctions.flatMap((func) => extractReferencedDefs(importedAbi, func));
  const referencedEnumsFromFunctions = refsFromFunctions.filter((ref) => ref.kind === "Enum") as EnumDef[];
  const referencedObjectsFromFunctions = refsFromFunctions.filter((ref) => ref.kind === "Object") as ObjectDef[];

  treeShakenAbi.enums = [...importedEnums, ...referencedEnumsFromObjects, ...referencedEnumsFromFunctions];
  treeShakenAbi.objects = [...importedObjects, ...referencedObjectsFromObjects, ...referencedObjectsFromFunctions];
  treeShakenAbi.functions = importedFunctions;

  return treeShakenAbi;
}

const mergeAbis = (abis: Abi[]): Abi => {
  const mergedAbi: Abi = {
    version: "0.2"
  };

  // TODO: imports?

  const enums = abis.flatMap((abi) => abi.enums ?? []);
  const objects = abis.flatMap((abi) => abi.objects ?? []);
  const functions = abis.flatMap((abi) => abi.functions ?? []);

  mergedAbi.enums = enums;
  mergedAbi.objects = objects;
  mergedAbi.functions = functions;

  return mergedAbi;
}

export const linkAbiImports = ({ importStatements, abi, imports }: LinkImportsAbiArgs): Abi => {
  const treeShakenImports = new Map<string, Abi>();
  let abiClone: Abi = JSON.parse(JSON.stringify(abi));

  // Tree shake imported ABIs
  importStatements.forEach((importStatement) => {
    const { uriOrPath } = importStatement;
  
    const importedAbi = imports.get(uriOrPath);

    if (!importedAbi) {
      throw new Error(`Imported ABI not found for '${uriOrPath}'`);
    }

    const treeShakenAbi = treeShakeImportedAbi(importedAbi, importStatement);
    treeShakenImports.set(uriOrPath, treeShakenAbi);
  });

  if (treeShakenImports.size && !abiClone.imports) {
    abiClone.imports = [];
  }

  const externalImportsStatements = importStatements.filter((importStatement) => importStatement.kind === "external") as ExternalImportStatement[];
  const localImportsStatements = importStatements.filter((importStatement) => importStatement.kind === "local") as LocalImportStatement[];

  // Merge local imports

  localImportsStatements.forEach((localImportStatement) => {
    const { uriOrPath } = localImportStatement;
    const treeShakenAbi = treeShakenImports.get(uriOrPath);

    if (!treeShakenAbi) {
      throw new Error(`Tree shaken ABI not found for '${uriOrPath}'`);
    }

    abiClone = mergeAbis([abiClone, treeShakenAbi]);
  });

  // Embed external imports
  
  externalImportsStatements.forEach((importStatement, i) => {
    const { uriOrPath, importedTypes } = importStatement;
    const treeShakenAbi = treeShakenImports.get(uriOrPath);

    if (!treeShakenAbi) {
      throw new Error(`Tree shaken ABI not found for '${uriOrPath}'`);
    }

    // TODO: better ID generation
    const id = i.toString()

    abiClone.imports!.push({
      uri: uriOrPath,
      namespace: importStatement.namespace,
      id,
      // TODO: Where do I get this from?
      type: "wasm",
      ...treeShakenAbi
    })

    // Link ImportRefs to external imports

    const importRefVisitor = new AbiVisitor({
      ImportRefType: (importRefType) => {
        const { ref_name } = importRefType;

        // TODO: Imports of imports?
        if (importedTypes.includes(ref_name)) {
          importRefType.import_id = id;
        }
      }
    })

    importRefVisitor.visit(abiClone);
  });

  return abiClone;
}