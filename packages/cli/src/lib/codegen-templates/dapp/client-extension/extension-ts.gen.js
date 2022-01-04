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
  config.typeInfo.trimTrailing = () => {
    return (value, render) => {
      let rendered = render(value);
      return rendered.trimEnd().replace(/[^\w\s]+$/, "");
    }
  }

  // Check for query and mutation modules
  const queryContext = config.typeInfo.queryTypes.find(def => {
    return def.type === "Query";
  });
  const mutationContext = config.typeInfo.queryTypes.find(def => {
    return def.type === "Mutation";
  });

  output.entries.push({
    type: "File",
    name: "./../baseTypes.ts",
    data: config.generate("./../types/baseTypes-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./types.ts",
    data: config.generate("./../types/packageTypes-ts.mustache", config.typeInfo),
  });
  if (queryContext) {
    output.entries.push({
      type: "File",
      name: "./query.ts",
      data: config.generate("module-ts.mustache", { ...queryContext, ...config.typeInfo }),
    });
  }
  if (mutationContext) {
    output.entries.push({
      type: "File",
      name: "./mutation.ts",
      data: config.generate("module-ts.mustache", { ...mutationContext, ...config.typeInfo }),
    });
  }
  output.entries.push({
    type: "File",
    name: "./classExtension.ts",
    data: config.generate("classExtension-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./typeExtension.ts",
    data: config.generate("typeExtension-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./index.ts",
    data: config.generate("nsIndex-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./../index.ts",
    data: config.generate("dappIndex-ts.mustache", config.typeInfo),
  });
};