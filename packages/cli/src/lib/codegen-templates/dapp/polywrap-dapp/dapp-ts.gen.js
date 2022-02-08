const { toPrefixedGraphQLType, transformTypeInfo } = require("@web3api/schema-parse");
const { PluginTs } = require("@web3api/schema-bind");

exports.run = (output, config) => {

  // Transform the TypeInfo to our liking
  config.typeInfo = transformTypeInfo(config.typeInfo, toPrefixedGraphQLType);
  config.typeInfo.toTypescript = PluginTs.Functions.toTypescript;
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
  config.typeInfo.trimTrailing = () => {
    return (value, render) => {
      let rendered = render(value);
      return rendered.trimEnd().replace(/[^\w\s]+$/, "");
    }
  }

  output.entries.push({
    type: "File",
    name: "./../baseTypes.ts",
    data: config.generate("./../types/baseTypes-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./../index.ts",
    data: config.generate("dappIndex-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./../PolywrapDapp.ts",
    data: config.generate("polywrapDappClass-ts.mustache", config.typeInfo),
  });
};