exports.run = (output, config) => {
  output.entries.push({
    type: "File",
    name: "./jsdoc.ts",
    data: config.generate("jsdoc.mustache", config.typeInfo),
  });
};
