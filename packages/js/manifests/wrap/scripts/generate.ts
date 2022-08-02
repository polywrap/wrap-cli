import path from "path";
import fs from "fs";
import * as os from "@polywrap/os-js";
import Mustache from "mustache";
import { compile } from "json-schema-to-typescript";
import { FileInfo, bundle, JSONSchema } from "json-schema-ref-parser";

async function generateFormatTypes() {
  // Fetch all schemas within the @polywrap/wrap-manifest-schemas/schemas/formats directory
  const schemasPackageDir = path.dirname(
    require.resolve("@polywrap/wrap-manifest-schemas")
  );
  const formatsDir = path.join(schemasPackageDir, "formats");

  // Resolve json-schema to typescript for wrap format type
  const formatTypeName = "wrap.info";
  const wrapDir = path.join(formatsDir, formatTypeName);
  const wrapOutputDir = path.join(
    __dirname,
    `../src/formats/${formatTypeName}`
  );
  const wrapModules: {
    interface: string;
    version: string;
    abiVersion: string;
  }[] = [];

  // Get all JSON schemas for this format type (v1, v2, etc)
  const wrapSchemaFiles = fs.readdirSync(wrapDir);
  const wrapSchemas: JSONSchema[] = [];

  for (let k = 0; k < wrapSchemaFiles.length; ++k) {
    const wrapSchemaName = wrapSchemaFiles[k];
    const wrapVersion = wrapSchemaName.replace(".json", "");
    const wrapSchemaPath = path.join(wrapDir, wrapSchemaName);

    try {
      // Parse the JSON schema
      const wrapSchema = JSON.parse(
        fs.readFileSync(wrapSchemaPath, { encoding: "utf-8" })
      );

      const abiJsonSchemaRelPath = wrapSchema.properties.abi.$ref;
      const abiJsonSchemaPath = path.join(wrapDir, abiJsonSchemaRelPath);
      const abiJsonSchema = JSON.parse(
        fs.readFileSync(abiJsonSchemaPath, { encoding: "utf-8" })
      );
      const abiVersion = path
        .parse(abiJsonSchemaPath)
        .base.replace(".json", "");

      const bundledSchema = await bundle(wrapSchema, {
        resolve: {
          file: {
            read: (file: FileInfo) => {
              // If both url is same
              if (!path.relative(abiJsonSchemaRelPath, file.url)) {
                return abiJsonSchema;
              }
              return file.data;
            },
          },
        },
      });

      const finalWrapSchema = JSON.parse(
        JSON.stringify(bundledSchema).replace(
          /unevaluatedProperties/g,
          "additionalProperties"
        )
      );
      wrapSchemas.push(finalWrapSchema);

      // Convert it to a TypeScript interface
      const tsFile = await compile(finalWrapSchema, wrapSchema.id);

      // Emit the result
      const tsOutputPath = path.join(wrapOutputDir, `${wrapVersion}.ts`);
      fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
      os.writeFileSync(
        tsOutputPath,
        `/* eslint-disable @typescript-eslint/naming-convention */\n${tsFile}`
      );

      const schemaOutputPath = path.join(wrapOutputDir, `${wrapVersion}.schema.json`);
      os.writeFileSync(schemaOutputPath, JSON.stringify(bundledSchema, null ,2));

      // Add metadata for the root index.ts file to use
      wrapModules.push({
        interface: wrapSchema.id,
        version: wrapVersion,
        abiVersion: abiVersion,
      });
    } catch (error) {
      console.error(
        `Error generating the Manifest file ${wrapSchemaPath}: `,
        error
      );
      throw error;
    }
  }

  const renderTemplate = (name: string, context: unknown) => {
    const tsTemplate = fs.readFileSync(
      path.join(__dirname, `/templates/${name}-ts.mustache`),
      { encoding: "utf-8" }
    );

    // Render the template
    const tsSrc = Mustache.render(tsTemplate, context);

    // Emit the source
    const tsOutputPath = path.join(wrapOutputDir, `${name}.ts`);
    fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
    os.writeFileSync(tsOutputPath, tsSrc);
  };

  const lastItem = <T>(arr: Array<T>) => arr[arr.length - 1];
  const versionToTs = (version: string) =>
    version.replace(/\./g, "_").replace(/\-/g, "_");

  const formats = wrapModules.map((module) => {
    return {
      type: module.interface,
      version: module.version,
      tsVersion: versionToTs(module.version),
      abiVersion: module.abiVersion,
      abiTsVersion: versionToTs(module.abiVersion),
    };
  });
  const latest = lastItem(formats);

  // Generate an index.ts file that exports root types that aggregate all versions
  const indexContext = {
    formats,
    latest,
  };

  renderTemplate("index", indexContext);

  // Generate a migrate.ts file that exports a migration function from all version to the latest version
  const migrateContext = {
    prevFormats: [...formats],
    latest: latest,
  };
  migrateContext.prevFormats.pop();

  renderTemplate("migrate", migrateContext);

  // Generate a deserialize.ts file that exports a deserialization function for the latest format version
  const deserializeContext = {
    type: migrateContext.latest.type,
  };

  renderTemplate("deserialize", deserializeContext);

  // Generate a validate.ts file that validates the manifest against the JSON schema
  const validateFormats = wrapModules.map((module) => {
    return {
      type: module.interface,
      version: module.version,
      tsVersion: versionToTs(module.version),
      abiVersion: module.abiVersion,
      abiTsVersion: versionToTs(module.abiVersion),
      dir: formatTypeName,
    };
  });

  const validateContext = {
    formats: validateFormats,
    latest: lastItem(validateFormats),
    validators: [] as string[],
  };

  // Extract all validators
  for (let k = 0; k < wrapSchemas.length; ++k) {
    const formatSchema = wrapSchemas[k];

    const getValidator = (obj: Record<string, unknown>) => {
      if (typeof obj !== "object") {
        return;
      }

      if (obj.format && typeof obj.format === "string") {
        if (validateContext.validators.indexOf(obj.format) === -1) {
          validateContext.validators.push(obj.format);
        }
      }

      const keys = Object.keys(obj);
      for (let j = 0; j < keys.length; ++j) {
        getValidator(obj[keys[j]] as Record<string, unknown>);
      }
    };

    getValidator(formatSchema as Record<string, unknown>);
  }

  renderTemplate("validate", validateContext);

  return Promise.resolve();
}

generateFormatTypes()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.abort();
  });
