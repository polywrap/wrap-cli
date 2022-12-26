import { Uri } from ".";

export interface InterfaceImplementations {
  interface: Uri;
  implementations: Uri[];
}

// export const sanitizeInterfaceImplementations = Tracer.traceFunc(
//   "core: sanitizeInterfaceImplementations",
//   (input: InterfaceImplementations[]): InterfaceImplementations[] => {
//     const output: InterfaceImplementations[] = [];
//     for (const definition of input) {
//       const interfaceUri = Uri.from(definition.interface);

//       const implementations = definition.implementations.map(Uri.from);

//       output.push({
//         interface: interfaceUri,
//         implementations: implementations,
//       });
//     }

//     return output;
//   }
// );
