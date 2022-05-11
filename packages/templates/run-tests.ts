import fs from "fs";
import path from "path";
import { execSync } from "child_process"

const rootDir = __dirname;

// Mapping of all project types (app, plugin, etc) to all supported languages
const projectLanguages: Record<string, string[]> = {};

// Populate all project types & languages by recursing 2 levels of directories
fs.readdirSync(rootDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .forEach(projectType =>
    projectLanguages[projectType] =
      fs.readdirSync(path.join(rootDir, projectType), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
  );

// Define the commands to run for each language
const languageTestCommands: Record<string, string[]> = {
  "typescript": [
    "yarn build",
    "yarn test"
  ],
  "assemblyscript": [
    "yarn build",
    "yarn test"
  ],
  "interface": [
    "yarn build"
  ],
};

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
      const output = execSync(
        command, {
          cwd: path.join(rootDir, projectType, language)
        }
      ).toString();
      console.log(output);
    }
  }
}
