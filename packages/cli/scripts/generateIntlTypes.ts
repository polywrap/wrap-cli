/* eslint-disable import/no-extraneous-dependencies */
import {
  Project,
  VariableDeclarationKind,
  SyntaxKind,
  IndentationText,
} from "ts-morph";
import fs from "fs";
import path from "path";

const tsConfigPath = `${__dirname}/../tsconfig.json`;
const defaultLanguagePath = `${__dirname}/../lang/en.json`;
const targetFilePath = `${__dirname}/../src/lib/intl/types.ts`;

function main(tsConfigPath: string, langPath: string, targetFilePath: string) {
  // create source file
  const project = new Project({
    tsConfigFilePath: tsConfigPath,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });
  const sourceFile = project.createSourceFile(targetFilePath, "", {
    overwrite: true,
  });
  // add lint ignore for file
  sourceFile.addStatements(
    "/// NOTE: This is an auto-generated file. See scripts/generateIntlTypes.ts"
  );
  sourceFile.addStatements("/* eslint-disable */");
  // import getIntl for formatjs
  const importFormatJsIntl = sourceFile.addImportDeclaration({
    moduleSpecifier: "./utils",
  });
  importFormatJsIntl.addNamedImport({ name: "getIntl" });
  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: "intl",
        initializer: "getIntl()",
      },
    ],
  });
  sourceFile.addStatements("");
  // declare IntlMsg interface
  const intlMsgInt = sourceFile.addInterface({ name: "IntlMsg" });
  intlMsgInt.setIsExported(true);
  // declare IntlStrings interface
  const intlStringsInt = sourceFile.addInterface({ name: "IntlStrings" });
  intlStringsInt.setIsExported(true);
  // declare IntlMsg object
  const intlMsgVar = sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: "intlMsg: IntlMsg",
        initializer: "{}",
      },
    ],
  });
  intlMsgVar.setIsExported(true);
  const intlMsgObj = intlMsgVar
    .getDeclarations()[0]
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  // read default language strings
  const messages: Record<string, string> = JSON.parse(
    fs.readFileSync(langPath, "utf-8")
  );
  // iterate and parse default language strings
  for (const [id, text] of Object.entries(messages)) {
    // add string to IntlStrings interface
    intlStringsInt.addProperty({ name: id, type: "string" });
    // read and parse interface fields for messages with arguments
    const args: string[] = [];
    for (let i = 0; i < text.length; i++) {
      let c = text.charAt(i);
      if (c === "{") {
        let arg = "";
        c = text.charAt(++i);
        while (c !== "}") {
          arg = arg + c;
          c = text.charAt(++i);
        }
        args.push(arg);
      }
    }
    // declare an options interface if message contains fields
    if (args.length > 0) {
      const intName = id + "_Options";
      const messageInt = sourceFile.addInterface({ name: intName });
      messageInt.setIsExported(true);
      for (const arg of args) {
        messageInt.addProperty({ name: arg, type: "string" });
      }
      // add to IntlMsg interface and obj -> with options argument
      intlMsgInt.addProperty({
        name: id,
        type: `(options: ${intName}) => string`,
      });
      intlMsgObj.addPropertyAssignment({
        name: id,
        initializer: `(options: ${intName}): string => intl.formatMessage({ id: "${id}", defaultMessage: "${text}" }, options)`,
      });
    } else {
      // add to IntlMsg interface and obj -> no options argument
      intlMsgInt.addProperty({ name: id, type: `() => string` });
      intlMsgObj.addPropertyAssignment({
        name: id,
        initializer: `(): string => intl.formatMessage({ id: "${id}", defaultMessage: "${text}" })`,
      });
    }
  }
  // save
  sourceFile.saveSync();

  // validate other lang json files to make sure they include all required messages
  const langFileName = path.basename(langPath);
  const langDir = path.dirname(langPath);
  const langs = fs.readdirSync(langDir).filter((lang) => lang !== langFileName);

  const langErrors: Record<string, string[]> = {};

  for (const lang of langs) {
    const langMessages: Record<string, string> = JSON.parse(
      fs.readFileSync(path.join(langDir, lang), "utf-8")
    );

    const missingMessages: string[] = [];

    for (const message of Object.keys(messages)) {
      if (!langMessages[message]) {
        missingMessages.push(message);
      }
    }

    if (missingMessages.length > 0) {
      langErrors[lang] = missingMessages;
    }
  }

  if (Object.keys(langErrors).length > 0) {
    throw Error(
      `Found lang files missing required commands:\n` +
        `${Object.keys(langErrors).map(
          (lang) => `"${lang}": ${JSON.stringify(langErrors[lang], null, 2)}\n`
        )}`
    );
  }
}

try {
  main(tsConfigPath, defaultLanguagePath, targetFilePath);
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
