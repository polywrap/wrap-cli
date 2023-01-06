// const _toGraphQLType = (rootType: string, type: string): string => {
//   const parsedCurrentType = _parseCurrentType(rootType, type);
//   let { subType } = parsedCurrentType;
//   const { currentType } = parsedCurrentType;

//   if (!subType) {
//     return currentType;
//   }

//   switch (currentType) {
//     case "Array": {
//       if (subType.endsWith("!")) {
//         subType = subType.slice(0, -1);
//       }
//       return `[${_toGraphQLType(rootType, subType)}]`;
//     }
//     case "Map": {
//       const firstDelimiter = subType.indexOf(",");

//       const keyType = subType.substring(0, firstDelimiter).trim();
//       const valType = subType.substring(firstDelimiter + 1).trim();

//       return `Map<${_toGraphQLType(rootType, keyType)}, ${_toGraphQLType(
//         rootType,
//         valType
//       )}>`;
//     }
//     default:
//       throw new Error(
//         `Found unknown type ${currentType} while parsing ${rootType}`
//       );
//   }
// };

// export function toGraphQLType(type: string): string {
//   return _toGraphQLType(type, type);
// }
