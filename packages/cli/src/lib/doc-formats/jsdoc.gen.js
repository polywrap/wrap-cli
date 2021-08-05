exports.run = (output, config) => {
  output.entries.push({
    type: "File",
    name: "./jsdoc.js",
    data: config.generate("jsdoc.mustache", config.typeInfo),
  });
};
