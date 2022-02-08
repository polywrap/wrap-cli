/* eslint-env es6 */
const { toPrefixedGraphQLType, transformTypeInfo } = require("@web3api/schema-parse");
const { AppTs } = require("@web3api/schema-bind");

exports.run = (output, config) => {

  // Transform the TypeInfo to our liking
  config.typeInfo = transformTypeInfo(config.typeInfo, toPrefixedGraphQLType);
  config.typeInfo.toTypescript = AppTs.Functions.toTypescript;

  output.entries.push({
    type: "File",
    name: "./types.ts",
    data: config.generate("packageTypes-ts.mustache", config.typeInfo),
  });
};