exports.generate = (output, config) => {
  output.entries.push({
    type: "File",
    name: "./schema1.ts",
    data: config.generate("./templates/schema1.mustache", config.abi),
  });

  output.entries.push({
    type: "Directory",
    name: "./folder",
    data: [
      {
        type: "File",
        name: "./schema2.ts",
        data: config.generate("./templates/schema2.mustache", config.abi),
      },
    ],
  });

  output.entries.push({
    type: "Template",
    name: "./schema3.ts",
    data: "./templates/schema3.mustache",
  });
};
