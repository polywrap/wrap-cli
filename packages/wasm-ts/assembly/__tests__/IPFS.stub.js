/**
 * Host Stub Functions:
 * Validates argument passing to and from WASM
 * host interface is working.
 */
module.exports = function (getModule, memory) {
  return {
    _w3_ipfs_get: (hashPtr) => {
      const { __getArray, __allocString } = getModule().exports

      return __allocString(
        String.fromCharCode.apply(
          null,
          __getArray(hashPtr)
        )
      );
    },
    _w3_ipfs_add: (dataPtr) => {
      const { __getArray, __allocString } = getModule().exports

      return __allocString(
        String.fromCharCode.apply(
          null,
          __getArray(dataPtr)
        )
      );
    }
  }
}
