//import * as mustache from "mustache";
import * as fs from 'fs';
import * as path from 'path';
import chalk = require('chalk');

function templatesDirectory(): string {
  return path.resolve(__dirname, "./templates");
}

function getTemplate(templateName: string): string {
  return fs.readFileSync(`${templatesDirectory()}/${templateName}.mustache`).toString();
}

const importStatementFinder = /^#import .+$/;
const importStatementExtractor = /^#import {([a-zA-Z0-9_, ]+?)} in (\w+?) from \"([a-zA-Z0-9_.]+?)\"$/;
const importTypeExtractor = /(\w+)/g;


function logError(msg: string) {
  console.error(`${msg}`);
}

async function tryouts() {

  const filepath = './src/__tests__/resources/test1_query.graphql';

  const queryFile = fs.readFileSync(filepath, 'utf-8');
  const queryFileLines = queryFile.split(/\r?\n/);

  interface FileImportStatement {
    line: number,
    statement: string
    imports: Maybe<ImportedType[]>
  }

  const detectedImports: FileImportStatement[] = [];
  
  // Detect import statements
  for (const [i, line] of queryFileLines.entries()) {
    if (importStatementFinder.test(line)) {
      detectedImports.push({
        line: i,
        statement: line,
        imports: undefined
      })
    }

    //console.log(`${i} > ${line}`);
  }

  interface ImportedType {
    namespace: string,
    source: string,
    name: string,
    fileStatement: FileImportStatement
  }

  const fileImports: { [namespace: string]: ImportedType[] } = {};
  let encounteredErrors = 0;
  for (const importStatement of detectedImports) {
    // Extract info about import statement
    const importMatches: Maybe<RegExpExecArray> = importStatementExtractor.exec(importStatement.statement);

    if (!importMatches) {
      encounteredErrors++;
      const lineNumber = importStatement.line + 1;
      logError(`${chalk.cyanBright(filepath)}:${chalk.yellow(lineNumber)} - ${chalk.red("error")}: Invalid import statement on line ${lineNumber}\n\n${chalk.bgWhite(chalk.black(lineNumber.toString().padStart(3)))}\t${importStatement.statement}\n`);
      continue;
    }

    const importNamespace = importMatches[2];
    const importSource = importMatches[3];
    const statementImportedTypes: ImportedType[] = [];

    // Extract imported types
    let numImportedTypes = 0;
    const importedTypeMatchIterator = importMatches[1].matchAll(importTypeExtractor);
    for (const match of importedTypeMatchIterator) {
      ++numImportedTypes;

      const importType = match[0];

      let importedTypesInNamespace = fileImports[importNamespace];
      if (!importedTypesInNamespace) {
        importedTypesInNamespace = [];
        fileImports[importNamespace] = importedTypesInNamespace;
      }

      const existingImport: Maybe<ImportedType> = importedTypesInNamespace.find((importedType: ImportedType) => {
        return importedType.name === importType;
      });

      if (existingImport) {
        encounteredErrors++;
        const lineNumber = importStatement.line + 1;
        const existingLineNumber = existingImport.fileStatement.line + 1;

        logError(`${chalk.cyanBright(filepath)}:${chalk.yellow(lineNumber)} - ${chalk.red("error")}: Imported type '${chalk.yellow(importType)}' has already been imported into the namespace '${chalk.yellow(importNamespace)}' from '${existingImport.source}' on line ${chalk.yellow(existingLineNumber)}.\n\n${chalk.bgGray(chalk.black(existingLineNumber.toString().padStart(3)))}\t${existingImport.fileStatement.statement}\n${chalk.bgWhite(chalk.black(lineNumber.toString().padStart(3)))}\t${importStatement.statement}\n`);
        continue;
      }

      const importedType = {
        namespace: importNamespace,
        source: importSource,
        name: importType,
        fileStatement: importStatement
      }

      importedTypesInNamespace.push(importedType);
      statementImportedTypes.push(importedType);
    }

    if (numImportedTypes === 0) {
      encounteredErrors++;
      const lineNumber = importStatement.line + 1;
      logError(`${chalk.cyanBright(filepath)}:${chalk.yellow(lineNumber)} - ${chalk.red("error")}: No imported types in import statement on line ${lineNumber}.\n\n${chalk.bgWhite(chalk.black(lineNumber.toString().padStart(3)))}\t${importStatement.statement}\n`);
      continue;
    }

    importStatement.imports = statementImportedTypes;
  }

  if (encounteredErrors > 0) {
    logError(`${chalk.red('Composer Error:')} Encountered ${chalk.yellow(encounteredErrors)} composition errors.`);
    return;
  }

  console.log(fileImports);
  console.log(detectedImports);


  const directiveTemplate = getTemplate('directives');
  //console.log(directiveTemplate);

  //mustache.render()
}

async function tryIt() {
  try {
    await tryouts();
  } catch (e) {
    console.log("ERROR");
    console.log(e);
  }
}

tryIt();