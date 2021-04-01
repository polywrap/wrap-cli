exports.run = (output, config) => {
  output.entries.push({
    type: "Directory",
    name: "./src",
    data: [
      {
        type: "File",
        name: "./index.ts",
        data: "./templates/index.mustache",
      },
      {
        type: "Template",
        name: "./manifest.ts",
        data: config.generate("./templates/manifest.mustache", config.typeInfo),
      },
      {
        type: "Template",
        name: "./resolvers.ts",
        data: "./templates/resolvers.mustache",
      },
    ],
  });
};
