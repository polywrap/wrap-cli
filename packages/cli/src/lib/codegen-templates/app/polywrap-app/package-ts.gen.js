const { toPrefixedGraphQLType, transformTypeInfo } = require("@web3api/schema-parse");
const { AppTs } = require("@web3api/schema-bind");

exports.run = (output, config) => {

  // Transform the TypeInfo to our liking
  config.typeInfo = transformTypeInfo(config.typeInfo, toPrefixedGraphQLType);
  config.typeInfo.toTypescript = AppTs.Functions.toTypescript;
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
  const queryContext = config.typeInfo.moduleTypes.find(def => {
    return def.type === "Query";
  });
  const mutationContext = config.typeInfo.moduleTypes.find(def => {
    return def.type === "Mutation";
  });

  output.entries.push({
    type: "File",
    name: "./types.ts",
    data: config.generate("./../types/packageTypes-ts.mustache", config.typeInfo),
  });
  if (queryContext) {
    output.entries.push({
      type: "File",
      name: "./queryTypes.ts",
      data: config.generate("moduleTypes-ts.mustache", { ...queryContext, ...config.typeInfo }),
    });
    output.entries.push({
      type: "File",
      name: "./query.ts",
      data: config.generate("moduleClass-ts.mustache", { ...queryContext, ...config.typeInfo }),
    });
  }
  if (mutationContext) {
    output.entries.push({
      type: "File",
      name: "./mutationTypes.ts",
      data: config.generate("moduleTypes-ts.mustache", { ...mutationContext, ...config.typeInfo }),
    });
    output.entries.push({
      type: "File",
      name: "./mutation.ts",
      data: config.generate("moduleClass-ts.mustache", { ...mutationContext, ...config.typeInfo }),
    });
  }
  output.entries.push({
    type: "File",
    name: "./extension.ts",
    data: config.generate("extensionClass-ts.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./index.ts",
    data: config.generate("packageIndex-ts.mustache", config.typeInfo),
  });
};