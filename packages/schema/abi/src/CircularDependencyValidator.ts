import { Abi } from "@polywrap/abi-types";
import { AbiVisitor } from ".";
import { DependencyTree } from "./DependencyTree";

export class CircularDependencyValidator {
  private definitionsTree: DependencyTree
  private importsTree: DependencyTree

  private traverseAbi(abi: Abi) {
    const state: { currentDepth: number; lastDepth: number, currentId: string; currentObject?: string } = {
      currentId: "",
      currentDepth: 0,
      lastDepth: 0,
      currentObject: undefined,
    }

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

          this.importsTree.addNode(state.currentId)
          state.lastDepth = state.currentDepth
        },
        ObjectDef: (objectDef) => {
          state.currentObject = objectDef.name
          this.definitionsTree.addNode(`${state.currentId}.${objectDef.name}`)
        },
        RefType: (refType) => {
          if (refType.ref_kind === "Object") {
            this.definitionsTree.addEdge(`${state.currentId}.${state.currentObject}`, `${state.currentId}.${refType.ref_name}`)
          }
        },
        ImportRefType: (importRefType) => {
          this.importsTree.addEdge(state.currentId, `${state.currentId}.${importRefType.import_id}`)

          if (importRefType.ref_kind === "Object") {
            this.definitionsTree.addEdge(`${state.currentId}.${state.currentObject}`, `${state.currentId}.${importRefType.import_id}.${importRefType.ref_name}`)
          }
        }
      },
      leave: {
        Imports: () => {
          state.currentDepth -= 1
        },
        ObjectDef: () => {
          state.currentObject = undefined
        },
      }
    });

    importsVisitor.visit(abi);
  }

  detectCircularDependencies(abi: Abi) {
    this.definitionsTree = new DependencyTree();
    this.importsTree = new DependencyTree();
    this.traverseAbi(abi);

    const circularDependencies = this.definitionsTree.findCircularDependencies();
    const circularImports = this.importsTree.findCircularDependencies();

    return {
      circularDependencies,
      circularImports,
    }
  }
}