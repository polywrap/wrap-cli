import { Abi, AbiDefs, EnumDef, ImportedAbi, ImportRefType, ObjectDef } from "@polywrap/abi-types";
import { IAbiMerger } from ".";
import { AbiVisitor } from "./AbiVisitor";

type ReferenceableDef = ObjectDef | EnumDef;

export interface IAbiTreeShaker {
  findReferencedDefinition(abi: Abi | ImportedAbi, ref: string): ReferenceableDef | undefined
  shakeTree(abi: Abi | ImportedAbi, neededDefNames: string[]): Abi | ImportedAbi
  shakeImports(abi: Abi | ImportedAbi): Abi | ImportedAbi
}

export class AbiTreeShaker implements IAbiTreeShaker {
  constructor(private _abiMerger: IAbiMerger) { }

  findReferencedDefinition(abi: Abi | ImportedAbi, refName: string): ReferenceableDef | undefined {
    // TODO: implement a stop to the search if the definition is found
    let found: ReferenceableDef | undefined = undefined;
    const visitor = new AbiVisitor({
      enter: {
        ObjectDef: (def) => {
          if (def.name === refName) {
            found = def;
          }
        },
        EnumDef: (def) => {
          if (def.name === refName) {
            found = def;
          }
        }
      }
    });

    visitor.visit(abi);

    return found;
  }

  extractNeededDefinitions(abi: Abi | ImportedAbi, neededDefNames: string[]): AbiDefs {
    const result: AbiDefs = {};
    const state: { currentObject?: string; currentFunction?: string } = {}
    const abiVisitor = new AbiVisitor({
      enter: {
        ObjectDef: (def) => {
          if (neededDefNames.includes(def.name)) {
            state.currentObject = def.name
            result.objects = result.objects ? [...result.objects, def] : [def]
          }
        },
        EnumDef: (def) => {
          if (neededDefNames.includes(def.name)) {
            result.enums = result.enums ? [...result.enums, def] : [def]
          }
        },
        FunctionDef: (def) => {
          if (neededDefNames.includes(def.name)) {
            state.currentFunction = def.name
            result.functions = result.functions ? [...result.functions, def] : [def]
          }
        },
      },
      leave: {
        ObjectDef: () => {
          state.currentObject = undefined
        },
        FunctionDef: () => {
          state.currentFunction = undefined
        },
      }
    });

    abiVisitor.visit(abi);

    return result;
  }

  extractImportReferences(abi: Abi): ImportRefType[] {
    const refsWithAbsIds: ImportRefType[] = [];
    const state: { currentId: string[] } = { currentId: [] };
    const abiVisitor = new AbiVisitor({
      enter: {
        Import: (importDef) => {
          state.currentId.push(importDef.id);
        },
        ImportRefType: (ref) => {
          state.currentId.push(ref.import_id);
          
          refsWithAbsIds.push({
            ...ref,
            import_id: state.currentId.join("."),
          });
        },
      },
      leave: {
        Import: () => {
          state.currentId.pop();
        },
        ImportRefType: () => {
          state.currentId.pop();
        }
      }
    });

    abiVisitor.visit(abi);

    return refsWithAbsIds;
  }

  extractReferencedSiblingDefinitions(abi: Abi | ImportedAbi, defs: AbiDefs): AbiDefs {
    const result: AbiDefs = {};
    const objectDefNames = defs.objects?.map((def) => def.name);
    const functionDefNames = defs.functions?.map((def) => def.name);
    const state: { currentObject?: string; currentFunction?: string } = {}
    const abiVisitor = new AbiVisitor({
      enter: {
        ObjectDef: (def) => {
          if (objectDefNames?.includes(def.name)) {
            state.currentObject = def.name
          }
        },
        FunctionDef: (def) => {
          if (functionDefNames?.includes(def.name)) {
            state.currentFunction = def.name
          }
        },
        RefType: (ref) => {
          const containingDefName = state.currentObject || state.currentFunction as string

          if (!containingDefName) {
            return;
          }

          if (containingDefName) {
            const referencedDef = this.findReferencedDefinition(abi, ref.ref_name)

            if (!referencedDef) {
              throw new Error(`Could not find referenced definition ${ref.ref_name} in ${containingDefName}`)
            }

            if (referencedDef.kind === "Object") {
              result.objects = result.objects ? [...result.objects, referencedDef] : [referencedDef]
            } else {
              result.enums = result.enums ? [...result.enums, referencedDef] : [referencedDef]
            }
          }
        },
      },
      leave: {
        ObjectDef: () => {
          state.currentObject = undefined
        },
        FunctionDef: () => {
          state.currentFunction = undefined
        },
      }
    });

    abiVisitor.visit(abi);

    return result;
  }

  private _shakeImports(abi: Abi, neededImports: ImportRefType[]): Abi {

    let abiClone = JSON.parse(JSON.stringify(abi));

    const state = {
      currentIdPath: [] as string[],
      neededImports
    }

    const importsVisitor = new AbiVisitor({
      enter: {
        Import: (importDef) => {
          state.currentIdPath.push(importDef.id)
          const currentId = state.currentIdPath.join(".")

          const neededFromThisImport = state.neededImports
            .filter((neededImport) => neededImport.import_id === currentId)
            .map((neededImport) => neededImport.ref_name)
          const shakenImportDef = this.shakeLocalDefinitions(importDef, neededFromThisImport) as ImportedAbi

          return shakenImportDef
        }

      },
      leave: {
        Import: () => {
          state.currentIdPath.pop()
        }
      }
    });

    importsVisitor.visit(abiClone);

    return abiClone;
  }

  shakeImports(abi: Abi): Abi {
    const neededImports = this.extractImportReferences(abi);
    const treeWithShakenImports = this._shakeImports(abi, neededImports);

    return treeWithShakenImports
  }

  shakeLocalDefinitions(abi: Abi | ImportedAbi, neededDefNames: string[]): Abi | ImportedAbi {
    const neededDefs = this.extractNeededDefinitions(abi, neededDefNames);
    const referencedDefs = this.extractReferencedSiblingDefinitions(abi, neededDefs);
    const shakenDefs = this._abiMerger.mergeDefs([neededDefs, referencedDefs])

    return {
      ...abi,
      objects: shakenDefs.objects,
      enums: shakenDefs.enums,
      functions: shakenDefs.functions,
    }
  }

  shakeTree(abi: Abi, neededDefNames: string[]): Abi | ImportedAbi {
    const shakenTree = this.shakeLocalDefinitions(abi, neededDefNames);
    const shakenTreeWithShakenImports = this.shakeImports(shakenTree as Abi);
    return shakenTreeWithShakenImports;
  }
}