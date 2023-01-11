import { typeTestCases } from "./core/type-test-cases";
import { subinvokeCase } from "./core/wrap-features/subinvoke-case";
import { envTestCases } from "./core/wrap-features/env-case";
import { interfaceInvokeCase } from "./core/wrap-features/interface-implementation-case";

export const supportedImplementations = ["as", "rs"];
describe.each(supportedImplementations)("client <-> wrappers end to end", (i) => {
		typeTestCases(i)
		subinvokeCase(i)
		envTestCases(i)
		interfaceInvokeCase(i)
})