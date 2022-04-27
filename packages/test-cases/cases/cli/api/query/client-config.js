const { Plugin, PluginModule, PluginModules } = require("@web3api/core-js");

const mockPlugin = () => {

  class Query extends PluginModule {
    getData() { return this.config.val; }
  }

  class Mutation extends PluginModule {
    setData(input) {
      this.config.val = +input.options.value;
      return { txReceipt: "0xdone", value: this.config.val };
    }

    deployContract() { return "0x100"; }
  }

  class MockPlugin {
    _config = {
      val: 0,
    };

    getModules() {
      return {
        query: new Query(this._config),
        mutation: new Mutation(this._config),
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
