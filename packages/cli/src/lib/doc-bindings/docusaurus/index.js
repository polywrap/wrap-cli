
exports.run = (output, config) => {

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

  const queryContext = config.typeInfo.moduleTypes.find(def => {
    return def.type === "Query";
  });
  const mutationContext = config.typeInfo.moduleTypes.find(def => {
    return def.type === "Mutation";
  });

  if (queryContext) {
    output.entries.push({
      type: "File",
      name: "./queries.md",
      data: config.generate("docusaurus-modules.mustache", { ...queryContext, ...config.typeInfo }),
    });
  }
  if (mutationContext) {
    output.entries.push({
      type: "File",
      name: "./mutations.md",
      data: config.generate("docusaurus-modules.mustache", { ...mutationContext, ...config.typeInfo }),
    });
  }
  output.entries.push({
    type: "File",
    name: "./types.md",
    data: config.generate("docusaurus-types.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./enums.md",
    data: config.generate("docusaurus-enums.mustache", config.typeInfo),
  });
};
