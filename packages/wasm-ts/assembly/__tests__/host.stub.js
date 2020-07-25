module.exports = (memory, createImports, instantiateSync, binary) => {
  let result;
  const stubImports = {
    ipfs: require("./IPFS.stub")(() => result, memory)
  };

  result = instantiateSync(
    binary,
    createImports(stubImports)
  );

  return result;
}
