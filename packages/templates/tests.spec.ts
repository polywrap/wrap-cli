import fs from "fs";
import path from "path";
import { exec } from "child_process";

jest.setTimeout(600000);

describe("Templates", () => {
  const rootDir = __dirname;

  // Mapping of all project types (app, plugin, etc) to all supported languages
  const projectLanguages: Record<string, string[]> = {};

  // Define the commands to run for each language
  const languageTestCommands: Record<string, Record<string, string>> = {
    typescript: { build: "yarn build", test: "yarn test" },
    "typescript-node": {
      // Uncomment when the helloworld wrapper has been deployed to polywrap.eth
      // build: "yarn build",
      // test: "yarn test",
    },
    "typescript-react": {
      // Uncomment when the helloworld wrapper has been deployed to polywrap.eth
      // build: "CI=false yarn build"
    },
    assemblyscript: {
      // Workflow tests fail in CI because cuelang is not installed
      build: "yarn build",
      test: "yarn test:e2e",
      // "yarn test:workflow"
    },
    rust: {
      // Workflow tests fail in CI because cuelang is not installed
      build: "yarn build",
      test: "yarn test:e2e",
      // "yarn test:workflow"
    },
    interface: { build: "yarn build" },
    docusaurus: {
      install: "yarn install --no-lockfile",
      build: "yarn build",
    },
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
    for (const language of projectLanguages[projectType]) {
      // run the test commands at commands[language]
      let commands = languageTestCommands[language];

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

      // run all commands
      for (const command of Object.keys(commands)) {
        test(`${projectType}/${language} > ${command}`, async () => {
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
    }
  }
});
