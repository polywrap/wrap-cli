import { TypeInfoTransforms } from ".";
import { MethodDefinition, isEnvInputField } from "../typeInfo";

export const methodHasEnv: TypeInfoTransforms = {
  enter: {
    MethodDefinition: (method: MethodDefinition) => ({
      ...method,
      hasEnv: method.arguments.some(({ name }) => isEnvInputField(name ?? "")),
    }),
  },
};
