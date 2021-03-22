import fs from "fs";
import { Project, VariableDeclarationKind, SyntaxKind } from "ts-morph";

const tsConfigPath = `${__dirname}/../../../tsconfig.json`;
const defaultLanguagePath = `${__dirname}/../lang/en.json`;
const targetFilePath = `${__dirname}/../src/lib/internationalization/languageConfig.ts`;

generateLanguageTypes(tsConfigPath, defaultLanguagePath, targetFilePath);

function generateLanguageTypes(tsConfigPath: string, defaultLangPath: string, targetFilePath: string) {
  // create source file
  const project = new Project({
    tsConfigFilePath: tsConfigPath,
  });
  const sourceFile = project.createSourceFile(targetFilePath, "", { overwrite: true });
  // add lint ignore for file
  sourceFile.addStatements("/* eslint-disable */");
  // import getIntl for formatjs
  const importFormatJsIntl = sourceFile.addImportDeclaration({
    moduleSpecifier: "./internationalization",
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
    fs.readFileSync(defaultLangPath, "utf-8")
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
      intlMsgInt.addProperty({ name: id, type: `(options: ${intName}) => string` });
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
}
