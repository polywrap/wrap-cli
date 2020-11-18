import * as mustache from "mustache";
import * as fs from 'fs';
import * as path from 'path';
import chalk = require('chalk');

import * as graphTools from 'graphql-tools';
import * as graphql from 'graphql';

function templatesDirectory(): string {
  return path.resolve(__dirname, "./templates");
}

function getTemplate(templateName: string): string {
  return fs.readFileSync(`${templatesDirectory()}/${templateName}.mustache`).toString();
}

const importStatementFinder = /^#import .+$/;
const importStatementExtractor = /^#import {([a-zA-Z0-9_, ]+?)} into (\w+?) from \"([a-zA-Z0-9_.\/]+?)\"$/;
const importTypeExtractor = /(\w+)/g;

function logDebug(msg: string) {
  console.log(`${chalk.green("Debug: ")} ${msg}`);
}

function logError(msg: string) {
  console.error(`${msg}`);
}

interface ImportedSchema {
  source: string,
  schema: string,
  local: boolean
}

const importedSchemaCache: { [source: string]: ImportedSchema } = {};
const getImportedSchema = async (source: string): Promise<ImportedSchema> => {
  let cache = importedSchemaCache[source];
  if (cache) {
    return cache;
  }

  // Not in cache, go fetch it

  if (source[0] === ".") {
    // source is a file path, so it's a local import
    const importPath = path.resolve(__dirname, '..', 'src', '__tests__', 'resources', source);
    logDebug(`Resolving '${chalk.yellow(source)}' to '${chalk.yellow(importPath)}'`);

    let schema = "";
    try {
      schema = fs.readFileSync(importPath).toString();
    } catch (e) {
      throw Error(`Unable to find import '${source}' at '${importPath}'`);
    }
    

    importedSchemaCache[source] = {
      source,
      schema,
      local: true
    }

    return getImportedSchema(source);
  }

  // source must be an ENS
  // @TODO: actually resolve

  // hack for now
  source = source.replace('.eth', '.graphql');

  const importPath = path.resolve(__dirname, '..', 'src', '__tests__', 'resources', 'imports', source);
  logDebug(`Resolving external import '${chalk.yellow(source)}' to '${chalk.yellow(importPath)}'`);

  let schema = "";
  try {
    schema = fs.readFileSync(importPath).toString();
  } catch (e) {
    throw Error(`Unable to find external import '${source}' at '${importPath}'`);
  }

  importedSchemaCache[source] = {
    source,
    schema,
    local: true
  }

  return getImportedSchema(source);
}

const getTypesFromSchema = async (schema: string, types: string[]) => {
  const sourceSchema = graphql.parse(schema);

  const builtSchema = graphql.buildSchema(schema);
  const foundType = builtSchema.getType("Query");
  if (!foundType) {
    return;
  }

  let insideObject = false;
  const ast = graphql.visit(sourceSchema, {
    // ObjectTypeDefinition(node) {
    //   console.log(node.kind);
    //   if (node.name.value !== "Query") {
    //     return null
    //   }

    //   return undefined
    // },
    // SchemaDefinition(node) {
    //   return null;
    // },
    enter(node, key, parent, path, ancestors) {
      if (node.kind === 'ObjectTypeDefinition') {
        console.log("inside type " + node.name.value);
        insideObject = true;
      }
      if (!insideObject) {
        return undefined;
      }
      if (node.kind === 'NamedType') {
        const typeNode = node as graphql.NamedTypeNode;
        console.log(`Found type ${typeNode.name.value}`);
      }

      return undefined;
      // @return
      //   undefined: no action
      //   false: skip visiting this node
      //   visitor.BREAK: stop visiting altogether
      //   null: delete this node
      //   any value: replace this node with the returned value
    },
    leave(node, key, parent, path, ancestors) {
      // @return
      //   undefined: no action
      //   false: no action
      //   visitor.BREAK: stop visiting altogether
      //   null: delete this node
      //   any value: replace this node with the returned value
      if (node.kind === 'ObjectTypeDefinition') {
        console.log("leaving type " + node.name.value);
        insideObject = false;
      }

      return false;
    }
  });


  console.log(graphql.print(ast));
}

/*
This is all POC code.
It's going to be refactored into modules / individual functions once a flow is proven out.
Until then I don't want to refactor it into modules because it might be the wrong organization
(want to fully understand the problem space first and see what parts can be discrete)
*/
async function tryouts() {

  const merged = graphTools.mergeTypeDefs([`type BigNumber {
    number: String!
  }`, `type Query {
    lengthOfString(
      name: String!
    ): Int!
  }`, `directive @imported(
    namespace: String!
    uri: String!
    type: String!
  ) on OBJECT
  directive @imports (
    types: [String!]!
  ) on OBJECT`]);
  console.log(graphql.print(merged));

  
  const t = graphTools.mergeTypeDefs([`type Test {
    number: String!
    thing: String!
  }`]);


  graphql.visit(t, {
    enter(node, key, parent, path, ancestors) {
      console.log(`Enter: ${node.kind}`);
      return undefined;
      // @return
      //   undefined: no action
      //   false: skip visiting this node
      //   visitor.BREAK: stop visiting altogether
      //   null: delete this node
      //   any value: replace this node with the returned value
    },
    leave(node, key, parent, path, ancestors) {
      // @return
      //   undefined: no action
      //   false: no action
      //   visitor.BREAK: stop visiting altogether
      //   null: delete this node
      //   any value: replace this node with the returned value
      console.log(`Leave: ${node.kind}`)

      return false;
    }
  })

  


  if (merged !== undefined) {
    return;
  }

  getTypesFromSchema(graphql.print(merged), ['Query']);

  /////

  const filepath = './src/__tests__/resources/test1_query.graphql';
  const loadPath = path.resolve(__dirname, '..', filepath);

  const queryFile = fs.readFileSync(loadPath, 'utf-8');
  const queryFileLines = queryFile.split(/\r?\n/);

  // I'm considering creating a (input line) -> (output line) converter which would take a given input line
  // and convert it out into 0 or more output lines
  
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


  let fileOutput = "";
  fileOutput;

  // Directives
  const directiveTemplate = getTemplate('directives');
  fileOutput += mustache.render(directiveTemplate, {});

  fileOutput += '\n';

  // Imported types
  const importedTypeTemplate = getTemplate('importedType');
  for (const importStatement of detectedImports) {
    if (!importStatement.imports) {
      logError(`${chalk.red('Internal Error:')} Attempted to reference imports from a type import that wasn't resolved.`);
      return;
    }

    for (const importedType of importStatement.imports) {

      // Fetch the contents of the type
      // For `.eth` packages this means an ENS look up and going to IPFS to pull the contents
      const importedSchema = await getImportedSchema(importedType.source);
      importedSchema;

      //const schemaContents = "";

      fileOutput += mustache.render(importedTypeTemplate, {
        qualifiedName: "",
        namespace: "",
        type: "",
        source: "",
        contents: "",
      })
    }

    

  }
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