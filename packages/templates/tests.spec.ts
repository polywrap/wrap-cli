import fs from "fs";
import path from "path";
import { exec, execSync } from "child_process";

jest.setTimeout(800000);

describe("Templates", () => {
  const rootDir = __dirname;

  // Mapping of all project types (app, plugin, etc) to all supported languages
  const projectLanguages: Record<string, string[]> = {};

  // Define the commands to run for each language
  const languageTestCommands: Record<string, Record<string, string>> = {
    typescript: { build: "yarn codegen", test: "yarn test" },
    python: {
      install: "poetry install",
      codegen: "npx polywrap codegen",
      build: "poetry build",
      test: "yarn test",
    },
    assemblyscript: {
      codegen: "yarn codegen",
      build: "npx polywrap build -m ./polywrap.wasm-assemblyscript-linked.yaml",
      test: "yarn test",
    },
    "wasm/rust": {
      codegen: "yarn codegen",
      build: "yarn build -m ./polywrap.wasm-rust-linked.yaml",
      test: "yarn test",
    },
    "wasm/golang": {
      codegen: "yarn codegen",
      build: "yarn build",
      test: "yarn test",
    },
    "wasm/typescript": {
      codegen: "yarn codegen",
      build: "yarn build",
      test: "yarn test",
    },
    "plugin/rust": {
      codegen: "npx polywrap codegen",
      build: "cargo build",
      test: "cargo test",
    },
    "app/android": {
      codegen: "npx polywrap codegen",
      build: "./gradlew assemble",
    },
    "app/ios": {
      codegen: "npx polywrap codegen",
    },
    "app/rust": {
      codegen: "npx polywrap codegen",
      build: "cargo build",
      test: "cargo test",
    },
    interface: { build: "npx polywrap build" },
  };

  // Filter unnecessary directories
  const filter = ["node_modules", "coverage"];

  // Populate all project types & languages by recursing 2 levels of directories
  fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(
      (dirent) => dirent.isDirectory() && filter.indexOf(dirent.name) === -1
    )
    .map((dirent) => dirent.name)
    .forEach(
      (projectType) =>
        (projectLanguages[projectType] = fs
          .readdirSync(path.join(rootDir, projectType), { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name))
    );

  // for each project + language
  for (const projectType of Object.keys(projectLanguages)) {
    describe(`${projectType}`, () => {
      for (const language of projectLanguages[projectType]) {
        describe(`${language}`, () => {
          // run the test commands at commands["project/language"] || commands["language"]
          let commands =
            languageTestCommands[`${projectType}/${language}`] ||
            languageTestCommands[language];

          // if nothing exists, try to match language as a substring
          if (!commands) {
            for (const testLanguage of Object.keys(languageTestCommands)) {
              if (language.indexOf(testLanguage) > -1) {
                commands = languageTestCommands[testLanguage];
                break;
              }
            }
          }

          // if nothing exists, error
          if (!commands) {
            throw Error(
              `Unknown project language ${projectType}/${language}, no test commands found. Please update this script's configuration.`
            );
          }

          let originalCargoFile: string;
          let cargoFilePath: string;

          beforeAll(() => {
            // Copy test configs
            if (
              projectType === "wasm" &&
              language !== "interface" &&
              language !== "golang"
            ) {
              execSync(
                `cp ${rootDir}/polywrap.${projectType}-${language}-linked* ${rootDir}/${projectType}/${language}/`
              );

              if (language === "rust") {
                cargoFilePath = path.join(
                  rootDir,
                  projectType,
                  language,
                  "Cargo.toml"
                );

                originalCargoFile = fs.readFileSync(cargoFilePath, {
                  encoding: "utf-8",
                });
                const cargoFile = originalCargoFile.replace(
                  /polywrap-wasm-rs = \{ version = "0.1.0" \}/,
                  `polywrap-wasm-rs = { path = "${path.join(
                    rootDir,
                    "..",
                    "wasm",
                    "rs"
                  )}" }`
                );
                fs.writeFileSync(cargoFilePath, cargoFile);
              }
            }
          });

          afterAll(() => {
            // Remove test configs
            if (projectType === "wasm" && language !== "interface") {
              if (language === "rust") {
                fs.writeFileSync(cargoFilePath, originalCargoFile);
              }
              execSync(
                `rm ${rootDir}/${projectType}/${language}/polywrap.${projectType}-${language}-linked*`
              );
            }
          });

          // run all commands
          for (const command of Object.keys(commands)) {
            test(`${command}`, async () => {
              const execPromise = new Promise<{
                error: Error | null;
                stdout: string;
                stderr: string;
              }>((resolve) => {
                exec(
                  commands[command],
                  { cwd: path.join(rootDir, projectType, language) },
                  (error, stdout, stderr) => resolve({ error, stdout, stderr })
                );
              });

              const execResult = await execPromise;

              expect(execResult.error).toBeNull();
            });
          }
        });
      }
    });
  }
});
