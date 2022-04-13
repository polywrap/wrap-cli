exports.run = (output, config) => {
  output.entries.push({
    type: "File",
    name: "./index.html",
    data: config.generate("html-doc.mustache", config.typeInfo),
  });
  output.entries.push({
    type: "File",
    name: "./style.css",
    data: config.generate("html-doc-style.mustache", config.typeInfo),
  });
};
