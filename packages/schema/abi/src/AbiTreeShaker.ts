import { Abi, AbiDefs, EnumDef, ImportRefType, ObjectDef, RefType } from "./definitions";
import { AbiVisitor } from "./AbiVisitor";

type ReferenceableDef = ObjectDef | EnumDef;

export interface IAbiTreeShaker {
  findReferencedDefinition(abi: Abi, ref: RefType): ReferenceableDef | undefined
  shakeTree(abi: Abi, neededDefNames: string[]): Abi
  shakeImports(abi: Abi): Abi
}

export class AbiTreeShaker implements IAbiTreeShaker {
  findReferencedDefinition(abi: Abi, ref: RefType): ReferenceableDef | undefined {
    // TODO: implement a stop to the search if the definition is found
    let found: ReferenceableDef | undefined = undefined;
    const visitor = new AbiVisitor({
      enter: {
        ObjectDef: (def) => {
          if (def.name === ref.ref_name) {
            found = def;
          }
        },
        EnumDef: (def) => {
          if (def.name === ref.ref_name) {
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
            const referencedDef = this.findReferencedDefinition(abi, ref)

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

  private _shakeImports(abi: Abi, neededImports: ImportRefType[], state: { currentDepth: number; lastDepth: number, currentId: string } = {
    currentId: "",
    currentDepth: 0,
    lastDepth: 0,
  }): Abi {

    let abiClone = JSON.parse(JSON.stringify(abi));

    const importsVisitor = new AbiVisitor({
      enter: {
        Imports: () => {
          state.currentDepth += 1
        },
        Import: (importDef) => {
          // TODO: this logic works but could be improved
          if (state.currentDepth > state.lastDepth) {
            state.currentId = `${state.currentId}.${importDef.id}`
          } else if (state.currentDepth < state.lastDepth) {
            state.currentId = state.currentId.split(".").slice(0, state.currentDepth - 1).join(".")
            state.currentId = `${state.currentId}.${importDef.id}`
          } else {
            state.currentId = state.currentId.split(".").slice(0, state.currentDepth - 1).join(".")
            state.currentId = `${state.currentId}.${importDef.id}`
          }

          state.lastDepth = state.currentDepth

          const neededFromThisImport = neededImports
            .filter((neededImport) => neededImport.import_id === state.currentId)
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
        Imports: () => {
          state.currentDepth -= 1
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