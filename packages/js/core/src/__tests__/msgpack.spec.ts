import {msgpackEncode, msgpackDecode, isBuffer} from "../msgpack";

describe("msgpack", () => {
  const expectedArrayLike = [
    130, 168, 102, 105, 114, 115, 116,  75,
    101, 121, 170, 102, 105, 114, 115, 116,
    86,  97, 108, 117, 101, 169, 115, 101,
    99, 111, 110, 100,  75, 101, 121, 171,
    115, 101,  99, 111, 110, 100,  86,  97,
    108, 117, 101
  ]
  it("Should encode and decode, returning the same object", () => {
    const customObject = {
      "firstKey": "firstValue",
      "secondKey": "secondValue",
    }
    const encoded = msgpackEncode(customObject)
    expect(encoded).toEqual(Uint8Array.from(expectedArrayLike))
    const decoded = msgpackDecode(encoded)
    expect(decoded).toEqual(customObject);
  });

  it("Should encode and decode, returning the same map", () => {
    const customMap = new Map()
    customMap.set("firstKey", "firstValue")
    customMap.set("secondKey", "secondValue")

    const encoded = msgpackEncode(customMap)
    // [199, 43, 1] are being added because of the map structure
    expect(encoded).toEqual(Uint8Array.from([ 199, 43, 1, ...expectedArrayLike]))
    const decoded = msgpackDecode(encoded)
    expect(decoded).toEqual(customMap);
  });

  it("Should check if object is buffer", () => {
    const notBuf = isBuffer(expectedArrayLike);
    expect(notBuf).toBeFalsy()
    const buf = isBuffer(Uint8Array.from(expectedArrayLike));
    expect(buf).toBeTruthy()
  })

});
