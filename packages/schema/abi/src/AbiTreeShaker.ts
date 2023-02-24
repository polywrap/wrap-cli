import { Abi, AbiDefs, EnumDef, ImportRefType, ObjectDef } from "@polywrap/abi-types";
import { AbiVisitor } from "./AbiVisitor";

type ReferenceableDef = ObjectDef | EnumDef;

export interface IAbiTreeShaker {
  findReferencedDefinition(abi: Abi, ref: string): ReferenceableDef | undefined
  shakeTree(abi: Abi, neededDefNames: string[]): Abi
  shakeImports(abi: Abi): Abi
}

export class AbiTreeShaker implements IAbiTreeShaker {
  findReferencedDefinition(abi: Abi, refName: string): ReferenceableDef | undefined {
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

  extractNeededDefinitions(abi: Abi, neededDefNames: string[]): AbiDefs {
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
    const result: ImportRefType[] = [];
    const abiVisitor = new AbiVisitor({
      enter: {
        ImportRefType: (ref) => {
          result.push(ref);
        }
      }
    });

    abiVisitor.visit(abi);

    return result;
  }

  extractReferencedSiblingDefinitions(abi: Abi, defs: AbiDefs): AbiDefs {
    const result: AbiDefs = {};
    const objectDefNames = defs.objects?.map((def) => def.name) || [];
    const functionDefNames = defs.functions?.map((def) => def.name) || [];
    const state: { currentObject?: string; currentFunction?: string } = {}
    const abiVisitor = new AbiVisitor({
      enter: {
        ObjectDef: (def) => {
          if (objectDefNames.includes(def.name)) {
            state.currentObject = def.name
          }
        },
        FunctionDef: (def) => {
          if (functionDefNames.includes(def.name)) {
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

  private _shakeImports(abi: Abi, neededImports: ImportRefType[], state: { currentIdPath: string[] } = {
    currentIdPath: []
  }): Abi {

    let abiClone = JSON.parse(JSON.stringify(abi));

    const importsVisitor = new AbiVisitor({
      enter: {
        Import: (importDef) => {
          state.currentIdPath.push(importDef.id)
          const currentId = state.currentIdPath.join(".")

          const neededFromThisImport = neededImports
            .filter((neededImport) => neededImport.import_id === currentId)
            .map((neededImport) => neededImport.ref_name)
          const neededDefsFromThisImport = this.extractNeededDefinitions({
            version: abiClone.version,
            ...importDef
          }, neededFromThisImport);
          const neededSiblingDefs = this.extractReferencedSiblingDefinitions({
            version: abiClone.version,
            ...importDef
          }, neededDefsFromThisImport);

          importDef = {
            id: importDef.id,
            uri: importDef.uri,
            namespace: importDef.namespace,
            type: importDef.type,
            ...neededDefsFromThisImport,
            ...neededSiblingDefs,
          }

          const transitiveImports = this.extractImportReferences({
            version: abiClone.version,
            ...importDef
          });

          abiClone = this._shakeImports({
            version: abiClone.version,
            ...importDef
          }, transitiveImports, state)
          
        }

      },
      leave: {
        Import: (importAbi) => {
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

  shakeTree(abi: Abi, neededDefNames: string[]): Abi {
    const neededDefs = this.extractNeededDefinitions(abi, neededDefNames);
    const referencedDefs = this.extractReferencedSiblingDefinitions(abi, neededDefs);
    const shakenTree = {
      version: abi.version,
      ...neededDefs,
      ...referencedDefs,
    }

    const shakenTreeWithShakenImports = this.shakeImports(shakenTree);
    return shakenTreeWithShakenImports;
  }
}