import {
  w3_add_invoke
} from "../";

function methodName(input: ArrayBuffer): ArrayBuffer {
  return new ArrayBuffer(0);
}

describe("Invoke: Sanity", () => {
  it("Compiles", () => {
    w3_add_invoke("methodName", methodName);
  });
});
