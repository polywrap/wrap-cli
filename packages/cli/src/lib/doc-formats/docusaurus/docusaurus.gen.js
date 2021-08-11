exports.run = (output, config) => {
  output.entries.push({
    type: "File",
    name: "./queries.md",
    data: config.generate("docusaurus-queries.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./mutations.md",
    data: config.generate("docusaurus-mutations.mustache", config.typeInfo),
  });
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
