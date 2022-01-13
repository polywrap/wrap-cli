const { Plugin } = require("@web3api/core-js");

const mockPlugin = () => {
  class MockPlugin extends Plugin {
    _val = 0;
    getModules(_client) {
      return {
        query: {
          getData: async (_) => {
            this._val;
          },
        },
        mutation: {
          setData: (input) => {
            this._val = parseInt(input.options.value);
            return { txReceipt: "0xdone", value: this._val };
          },
          deployContract: (_) => "0x100",
        },
      };
    }
  }

  return {
    factory: () => new MockPlugin(),
    manifest: {
      schema: ``,
      implements: [],
    },
  };
};

function getClientConfig(defaultConfigs) {
  if (defaultConfigs.plugins) {
    defaultConfigs.plugins.push({
      uri: "w3://ens/mock.eth",
      plugin: mockPlugin(),
    });
  } else {
    defaultConfigs.plugins = [
      {
        uri: "w3://ens/mock.eth",
        plugin: mockPlugin(),
      },
    ];
  }
  defaultConfigs.redirects = [
    {
      from: "w3://ens/testnet/simplestorage.eth",
      to: "w3://ens/mock.eth",
    },
  ];
  return defaultConfigs;
}

module.exports = {
  getClientConfig,
};
