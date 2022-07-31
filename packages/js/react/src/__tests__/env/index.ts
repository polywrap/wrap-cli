const Environment = require("jest-environment-jsdom");

/**
 * A custom environment to set the TextEncoder that is required by ../client/src/wasm/WasmWrapper.ts.
 */
module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    this.global.XMLHttpRequest = undefined;
    if (!this.global.TextEncoder || !this.global.TextDecoder) {
      const { TextEncoder, TextDecoder } = require("util");
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
};
