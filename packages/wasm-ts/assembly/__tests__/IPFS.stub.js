/**
 * Host Stub Functions:
 * Validates argument passing to and from WASM
 * host interface is working.
 */
module.exports = function (getModule, memory) {
  return {
    _w3_ipfs_cat: (hashPtr) => {
      const {
        __getString,
        __allocString,
        __retain
      } = getModule().exports;
      const str = __getString(hashPtr);
      const strArray = new Uint8Array(Buffer.from(str, 'utf-8'));
      const ptr = __retain(__allocString(
        String.fromCharCode.apply(null, strArray)
      ));
      return ptr;
    },
    _w3_ipfs_add: (dataPtr) => {
      const {
        __getString,
        __allocString,
        __retain
      } = getModule().exports

      return __retain(__allocString(__getString(dataPtr)));
    }
  }
}
