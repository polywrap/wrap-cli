exports.run = (output, config) => {
  output.entries.push({
    type: "File",
    name: "./index.html",
    data: config.generate("standard.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./style.css",
    data: config.generate("standard-style.mustache", config.typeInfo),
  });
};
