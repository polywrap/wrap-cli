module.exports = (memory, createImports, instantiateSync, binary) => {
  let result;
  const myImports = {
    ipfs: {
      __w3_ipfs_get: () => {
        console.log("HERERERERE")
        console.log(this.arguments)
      },
      __w3_ipfs_add: (dataPtr) => {
        const { __getArray, __allocString } = result.exports

        console.log("NOW HERERERE")
        console.log(
          String.fromCharCode.apply(null, __getArray(dataPtr))
        )

        return __allocString("foo");
      }
    }
  };
  result = instantiateSync(binary, createImports(myImports));
  return result;
}
