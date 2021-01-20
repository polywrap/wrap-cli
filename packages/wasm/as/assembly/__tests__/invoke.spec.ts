import { w3_add_invoke, w3_invoke } from "../";

function methodName(_input: ArrayBuffer): ArrayBuffer {
  return new ArrayBuffer(0);
}

describe("Invoke: Sanity", () => {
  it("Compiles", () => {
    w3_add_invoke("methodName", methodName);
    w3_invoke(1, 1);
  });
});
