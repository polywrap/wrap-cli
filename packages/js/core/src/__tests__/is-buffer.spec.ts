import { isBuffer } from "../utils/is-buffer";

it("Should check if object is buffer", () => {
  const array = [
    130, 168, 102, 105, 114, 115, 116,  75,
    101, 121, 170, 102, 105, 114, 115, 116,
    86,  97, 108, 117, 101, 169, 115, 101,
    99, 111, 110, 100,  75, 101, 121, 171,
    115, 101,  99, 111, 110, 100,  86,  97,
    108, 117, 101
  ]
  expect(isBuffer(array)).toBeFalsy();
  expect(isBuffer(Uint8Array.from(array))).toBeTruthy();
  expect(isBuffer(Uint8Array.from(array).buffer)).toBeTruthy();
});
