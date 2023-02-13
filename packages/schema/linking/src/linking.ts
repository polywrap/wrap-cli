import { ImportStatement } from "@polywrap/schema-parse";
import { Abi, AnyType, EnumDef, FunctionDef, ImportRefType, ObjectDef, RefType } from "@polywrap/schema-parse/build/definitions";

interface LinkImportsAbiArgs {
  importStatements: ImportStatement[];
  abi: Abi;
  imports: Map<string, Abi>;
}

type DefsWithDependencies = ObjectDef | FunctionDef;
type DefsThatCanBeReferenced = ObjectDef | EnumDef;
const KINDS_WITH_DEPENDENCIES = ["Object", "Function"] as const;
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

const extractReferencedDefs = (abi: Abi, depdendency: DefsWithDependencies): DefsThatCanBeReferenced[] => {
  switch (depdendency.kind) {
    case "Object": {
      const dependencies: DefsThatCanBeReferenced[] = [];

      for (const property of depdendency.props) {
        const ref = extractRefFromAnyType(property.type);

        if (ref) {
          const definition = extractDefFromRef(abi, ref);
          dependencies.push(definition);

          if (definition.kind in KINDS_WITH_DEPENDENCIES) {
            dependencies.push(...extractReferencedDefs(abi, definition as DefsWithDependencies));
          }
        }
        // TODO: ImportRef handling
      };

      return dependencies;
    }
    case "Function": {
      let dependencies: DefsThatCanBeReferenced[] = [];

      for (const arg of depdendency.args) {
        const ref = extractRefFromAnyType(arg.type);

        if (ref) {
          const definition = extractDefFromRef(abi, ref);
          dependencies.push(definition);

          if (definition.kind in KINDS_WITH_DEPENDENCIES) {
            dependencies.push(...extractReferencedDefs(abi, definition as DefsWithDependencies));
          }
        }
      }

      const ref = extractRefFromAnyType(depdendency.result.type);

      if (ref) {
        const definition = extractDefFromRef(abi, ref);
        dependencies.push(definition);

        if (definition.kind in KINDS_WITH_DEPENDENCIES) {
          dependencies.push(...extractReferencedDefs(abi, definition as DefsWithDependencies));
        }
      }

      return dependencies;
    }
  }
}

export const linkAbiImports = ({ importStatements, abi, imports }: LinkImportsAbiArgs): Abi => {
  importStatements.forEach((importStatement) => {
    const { importedTypes, uriOrPath } = importStatement;
    const importedAbi = imports.get(uriOrPath);

    importedAbi?.objects?.filter
  })
}