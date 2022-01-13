/* eslint-env es6 */
const { toPrefixedGraphQLType, transformTypeInfo } = require("@web3api/schema-parse");
const { toTypescript } = require("@web3api/schema-bind");

exports.run = (output, config) => {

  // Transform the TypeInfo to our liking
  config.typeInfo = transformTypeInfo(config.typeInfo, toPrefixedGraphQLType);
  config.typeInfo.toTypescript = toTypescript;

  output.entries.push({
    type: "File",
    name: "./../baseTypes.ts",
    data: config.generate("baseTypes-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./../index.ts",
    data: config.generate("dappIndex-ts.mustache", config.typeInfo),
  });
};