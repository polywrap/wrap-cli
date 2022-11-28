import {
  MethodDefinition, PropertyDefinition,
} from ".";

export default (
  importedMethod: MethodDefinition,
  expectedMethod: MethodDefinition
): boolean => {
    if (expectedMethod.name === importedMethod.name) {
      return false
    }

    if (expectedMethod.arguments) {
      const expectedArgs = expectedMethod.arguments.some(({type, name}, index) => {
        const importedArgs = importedMethod.arguments as PropertyDefinition[]
        const { name: importedName, type: importedType } = importedArgs[index]
        return importedName === name && importedType === type
      })

      if (!expectedArgs) {
        return false
      }
    }
    return true
}
