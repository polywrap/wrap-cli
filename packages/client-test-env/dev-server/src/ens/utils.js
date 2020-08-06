export function loadContract(modName, contractName) {
  if (modName === 'ens') {
    const ens = require(`@ensdomains/ens`)
    return ens[contractName]
  }
  return require(`@ensdomains/${modName}/build/contracts/${contractName}`)
}

export function deploy(web3, account, contractJSON, ...args) {
  const contract = new web3.eth.Contract(contractJSON.abi)
  return contract
    .deploy({
      data: contractJSON.bytecode,
      arguments: args
    })
    .send({
      from: account,
      gas: 6700000
    })
}
