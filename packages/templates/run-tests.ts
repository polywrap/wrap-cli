import fs from "fs";
import path from "path";
import { execSync } from "child_process"

const rootDir = __dirname;

// Mapping of all project types (app, plugin, etc) to all supported languages
const projectLanguages: Record<string, string[]> = {};

// Define the commands to run for each language
const languageTestCommands: Record<string, string[]> = {
  "typescript": [
    // Uncomment once wrap-man files has been removed
    // "yarn build",
    // "yarn test"
  ],
  "typescript-node": [
    // Uncomment when the helloworld wrapper has been deployed to polywrap.eth
    // "yarn build",
    // "yarn test"
  ],
  "typescript-react": [
    // Uncomment when the helloworld wrapper has been deployed to polywrap.eth
    // "CI=false yarn build"
  ],
  "assemblyscript": [
    // Workflow tests fail in CI because cuelang is not installed
    "yarn build",
    "yarn test:e2e",
    // "yarn test:workflow"
  ],
  "rust": [
    // Workflow tests fail in CI because cuelang is not installed
    "yarn build",
    "yarn test:e2e",
    // "yarn test:workflow"
  ],
  "interface": [
    "yarn build"
  ],
  "docusaurus": [
    "yarn install --no-lockfile",
    "yarn build"
  ]
};

// Filter unnecessary directories
const filter = ["node_modules"];

// Populate all project types & languages by recursing 2 levels of directories
fs.readdirSync(rootDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && filter.indexOf(dirent.name) === -1)
  .map(dirent => dirent.name)
  .forEach(projectType =>
    projectLanguages[projectType] =
      fs.readdirSync(path.join(rootDir, projectType), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
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
    for (const command of commands) {
      console.log(`run-tests: ${projectType}/${language} > ${command}`);
      try {
        const output = execSync(
          command, {
            cwd: path.join(rootDir, projectType, language)
          }
        ).toString();
        console.log(output);
      } catch (e) {
        if (e.stdout) {
          e.stdout = e.stdout.toString();
        }
        if (e.stderr) {
          e.stderr = e.stderr.toString();
        }
        console.error(`status: ${e.status}`);
        console.error(`stdout: ${e.stdout}`);
        console.error(`stderr: ${e.stderr}`);
        throw e;
      }
    }
  }
}
