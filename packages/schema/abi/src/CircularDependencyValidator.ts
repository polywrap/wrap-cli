import { Abi } from "@polywrap/abi-types";
import { AbiVisitor } from ".";
import { DependencyTree } from "./DependencyTree";

export class CircularDependencyValidator {
  private definitionsTree: DependencyTree
  private importsTree: DependencyTree

  private traverseAbi(abi: Abi) {
    const state: { currentIdPath: string[]; currentObject?: string } = {
      currentIdPath: [],
      currentObject: undefined
    }

    const importsVisitor = new AbiVisitor({
      enter: {
        Import: (importDef) => {
          state.currentIdPath.push(importDef.id)
          const currentId = state.currentIdPath.join(".")

          this.importsTree.addNode(currentId)
        },
        ObjectDef: (objectDef) => {
          state.currentObject = objectDef.name
          const currentId = state.currentIdPath.join(".")
          this.definitionsTree.addNode(`${currentId}.${objectDef.name}`)
        },
        RefType: (refType) => {
          if (refType.ref_kind === "Object") {
            const currentId = state.currentIdPath.join(".")
            this.definitionsTree.addEdge(`${currentId}.${state.currentObject}`, `${currentId}.${refType.ref_name}`)
          }
        },
        ImportRefType: (importRefType) => {
          const currentId = state.currentIdPath.join(".")
          this.importsTree.addEdge(currentId, `${currentId}.${importRefType.import_id}`)

          if (importRefType.ref_kind === "Object") {
            this.definitionsTree.addEdge(`${currentId}.${state.currentObject}`, `${currentId}.${importRefType.import_id}.${importRefType.ref_name}`)
          }
        }
      },
      leave: {
        Import: () => {
          state.currentIdPath.pop()
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