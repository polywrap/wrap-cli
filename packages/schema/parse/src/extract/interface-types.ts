// import {
//   TypeInfo,
//   CapabilityType,
//   InvokableModules,
//   InterfaceDefinition,
//   createCapability,
//   CapabilityDefinition,
//   createInterfaceDefinition,
// } from "../typeInfo";
// import { State } from "./query-types-utils";
// import { extractImportedDefinition } from "./imported-types-utils";

// import {
//   ObjectTypeDefinitionNode,
//   ASTVisitor,
//   StringValueNode,
//   ListValueNode,
// } from "graphql";

// const visitorEnter = (interfaceTypes: InterfaceDefinition[], state: State) => ({
//   ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
//     const imported = extractImportedDefinition(node, true);

//     if (!imported) {
//       return;
//     }

//     const capabilities = (node.directives
//       ?.map((directive) => {
//         if (directive.name.value === "capability") {
//           const capability: Record<string, unknown> = {};
//           directive.arguments?.forEach((argument) => {
//             switch (argument.name.value) {
//               case "type": {
//                 capability.type = (argument.value as StringValueNode)
//                   .value as CapabilityType;
//                 break;
//               }
//               case "modules": {
//                 capability.modules = (argument.value as ListValueNode).values.map(
//                   (module) => {
//                     return (module as StringValueNode)
//                       .value as InvokableModules;
//                   }
//                 );
//                 break;
//               }
//               default: {
//                 throw Error("Not implemented!");
//               }
//             }
//           });
//           return capability
//             ? createCapability({
//                 type: (capability.type as unknown) as CapabilityType,
//                 modules: (capability.modules as unknown) as InvokableModules[],
//                 enabled: true,
//               })
//             : undefined;
//         }
//         return undefined;
//       })
//       .filter((capability) => capability !== undefined) ??
//       []) as CapabilityDefinition[];

//     if (capabilities.length === 0) {
//       return;
//     }

//     const capabilityType = capabilities.reduce((o1, o2) => ({ ...o1, ...o2 }));

//     const interfaceType = createInterfaceDefinition({
//       type: node.name.value,
//       uri: imported.uri,
//       namespace: imported.namespace,
//       capabilities: capabilityType,
//     });
//     interfaceTypes.push(interfaceType);
//     state.currentInterface = interfaceType;
//   },
// });

// const visitorLeave = (state: State) => ({
//   ObjectTypeDefinition: (_node: ObjectTypeDefinitionNode) => {
//     state.currentImport = undefined;
//   },
// });

// export const getInterfaceTypesVisitor = (typeInfo: TypeInfo): ASTVisitor => {
//   const state: State = {};

//   return {
//     enter: visitorEnter(typeInfo.interfaceTypes, state),
//     leave: visitorLeave(state),
//   };
// };
