/* eslint-env es6 */
const { toPrefixedGraphQLType, transformTypeInfo } = require("@web3api/schema-parse");
const { toTypescript } = require("@web3api/schema-bind");

exports.run = (output, config) => {

// Transform the TypeInfo to our liking
  config.typeInfo = transformTypeInfo(config.typeInfo, toPrefixedGraphQLType);
  config.typeInfo.toTypescript = toTypescript;
  config.typeInfo.title = () => {
    return (value, render) => {
      let rendered = render(value);
      return rendered.charAt(0).toUpperCase() + rendered.substring(1);
    }
  }
  config.typeInfo.lowerFirst = () => {
    return (value, render) => {
      let rendered = render(value);
      return rendered.charAt(0).toLowerCase() + rendered.substring(1);
    }
  }

  output.entries.push({
    type: "File",
    name: "./types.ts",
    data: config.generate("types-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./inputs.ts",
    data: config.generate("inputs-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./extension.ts",
    data: config.generate("methods-ts.mustache", config.typeInfo),
  });
};