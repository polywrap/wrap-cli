exports.run = (output, config) => {
  output.entries.push({
    type: "File",
    name: "./types-ts.ts",
    data: config.generate("types-ts.mustache", config.typeInfo),
  });
};