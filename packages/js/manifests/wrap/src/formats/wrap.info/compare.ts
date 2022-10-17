import {
  MethodDefinition, PropertyDefinition,
} from ".";

export function compareAbis(
  importedMethods: MethodDefinition[],
  expectedModules: MethodDefinition[]
): boolean {
    for (const method of importedMethods) {
      const currentMethod = expectedModules.find(({name}) => name === method.name)
      if (!currentMethod) {
        return false
      }

      if (currentMethod.arguments) {
        const expectedArgs = currentMethod.arguments.some(({type, name}, index) => {
          const importedArgs = method.arguments as PropertyDefinition[]
          const { name: importedName, type: importedType } = importedArgs[index]
          return importedName === name && importedType === type
        })

        if (!expectedArgs) {
          return false
        }
      }
    }
    return true
}
