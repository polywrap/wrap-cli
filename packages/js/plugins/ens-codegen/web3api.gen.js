exports.run = (output, config) => {
  output.entries.push({
    type: "File",
    name: "./schema1.ts",
    data: config.generate("./templates/schema.mustache", config.typeInfo),
  });

  output.entries.push({
    type: "Directory",
    name: "./folder",
    data: [
      {
        type: "File",
        name: "./schema2.ts",
        data: config.generate("./templates/schema.mustache", config.typeInfo),
      },
    ],
  });

  output.entries.push({
    type: "Template",
    name: "./schema3.ts",
    data: "./templates/schema.mustache",
  });
};
