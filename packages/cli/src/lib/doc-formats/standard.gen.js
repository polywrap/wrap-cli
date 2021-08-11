exports.run = (output, config) => {
  output.entries.push({
    type: "Directory",
    name: "./docs",
    data: [
      {
        type: "File",
        name: "./index.html",
        data: config.generate("standard.mustache", config.typeInfo),
      },
      {
        type: "File",
        name: "./style.css",
        data: config.generate("standard-style.mustache", config.typeInfo),
      },
    ],
  });
};
