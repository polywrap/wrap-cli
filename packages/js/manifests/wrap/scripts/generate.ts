import path from "path";
import fs from "fs";
import axios from "axios";
import * as os from "@polywrap/os-js";
import Mustache from "mustache";
import { compile } from "json-schema-to-typescript";
import { FileInfo, bundle, JSONSchema } from "@apidevtools/json-schema-ref-parser";
// Workaround: https://github.com/APIDevTools/json-schema-ref-parser/issues/139#issuecomment-940500698
import $RefParser from '@apidevtools/json-schema-ref-parser';
$RefParser.bundle = $RefParser.bundle.bind($RefParser);

async function wrapCodegen() {
  const formatTypeName = "wrap.info";
  const wrapOutputDir = path.join(
    __dirname,
    `../src/formats/${formatTypeName}`
  );

  const wrapSchemas: JSONSchema[] = [];

  const wrapModules: {
    interface: string;
    version: string;
    abiVersion: string;
  }[] = [];

  const versions = (
    await axios.get(
      "https://raw.githubusercontent.com/polywrap/wrap/master/manifest/wrap.info/versions.json"
    )
  ).data;
  for (const version of versions) {
    const wrapSchema = (await axios.get(
      `https://raw.githubusercontent.com/polywrap/wrap/master/manifest/wrap.info/${version}.json`
    )).data;

    const bundledSchema = await bundle(wrapSchema, {
      resolve: {
        http: {
          read: async (file: FileInfo) => {
            const response = await axios.get(file.url);
            return response.data;
          },
        },
      },
    });

    wrapSchemas.push(bundledSchema);

    // Convert it to a TypeScript interface
    let tsFile = await compile(bundledSchema as any, wrapSchema.id, {additionalProperties: false});

    // Emit the result
    const tsOutputPath = path.join(wrapOutputDir, `${version}.ts`);
    fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
    os.writeFileSync(
      tsOutputPath,
      `/* eslint-disable @typescript-eslint/naming-convention */\n${tsFile}`
    );

    const schemaOutputPath = path.join(wrapOutputDir, `${version}.schema.json`);
    os.writeFileSync(schemaOutputPath, JSON.stringify(bundledSchema, null ,2));

    // Add metadata for the root index.ts file to use
    wrapModules.push({
      interface: wrapSchema.id,
      version: version,
      abiVersion: version,
    });
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
  const serializeContext = {
    type: migrateContext.latest.type,
  };

  renderTemplate("deserialize", serializeContext);
  renderTemplate("serialize", serializeContext);

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

wrapCodegen()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.abort();
  });
