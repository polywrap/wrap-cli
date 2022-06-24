import { TypeInfoTransforms } from ".";
import { isEnvInputField, MethodDefinition } from "../typeInfo";

export const methodArgIsEnv: TypeInfoTransforms = {
  enter: {
    MethodDefinition: (method: MethodDefinition) => ({
      ...method,
      arguments: method.arguments.map((arg) => ({
        ...arg,
        isEnv: isEnvInputField(arg.name ?? ""),
      })),
    }),
  },
};
