var uts46 = require(__dirname + "/../../../node_modules/@web3api/uts46-plugin-js");
var sha3 = require(__dirname + "/../../../node_modules/@web3api/sha3-plugin-js");

module.exports.redirects = [
  {
    from: "ens/uts46.web3api.eth",
    to: uts46.plugin()
  },
  {
    from: "ens/sha3.web3api.eth",
    to: sha3.plugin()
  }
];
