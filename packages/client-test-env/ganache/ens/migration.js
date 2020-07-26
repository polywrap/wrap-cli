
const ENS = artifacts.require('@ensdomains/ens/ENSRegistry.sol');
const PublicResolver = artifacts.require('@ensdomains/ens/PublicResolver.sol');
const ReverseRegistrar = artifacts.require('@ensdomains/ens/ReverseRegistrar.sol');
const namehash = require('eth-ens-namehash');

module.exports = function(deployer) {
  if (deployer.network !== 'development') {
    return;
  }

  const owner = web3.eth.accounts[0];
  const tld = 'eth';

  deployer.deploy(ENS)
    .then(() => {
      return deployer.deploy(PublicResolver, ENS.address);
    })
    .then(() => {
      return deployer.deploy(ReverseRegistrar, ENS.address, PublicResolver.address);
    })
    .then(() => {
      return ENS.at(ENS.address)
          // eth
        .setSubnodeOwner(0, web3.sha3(tld), owner, {from: owner});
    })
    .then(() => {
      return ENS.at(ENS.address)
        // reverse
        .setSubnodeOwner(0, web3.sha3('reverse'), owner, {from: owner});
    })
    .then(() => {
      return ENS.at(ENS.address)
        // addr.reverse
        .setSubnodeOwner(namehash.hash('reverse'), web3.sha3('addr'), ReverseRegistrar.address, {from: owner});
    })
}
