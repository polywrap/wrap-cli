import {
  createIntl,
  createIntlCache,
  IntlShape,
  IntlCache,
} from "@formatjs/intl";
import osLocale from "os-locale";
import { readFileSync } from "fs";
import * as fs from "fs";
import { Project, VariableDeclarationKind, SyntaxKind } from "ts-morph";

interface LocaleData {
  lang: string;
  messages: Record<string, string>;
}

const cache: IntlCache = createIntlCache();

export function getIntl(locale: string = osLocale.sync()): IntlShape<string> {
  const localeData: LocaleData = getLocaleData(locale);
  if (!fs.existsSync(`${__dirname}/lang.ts`)) {
    generateIntlTypes("en");
  }
  return createIntl(
    {
      locale: localeData.lang,
      defaultLocale: "en",
      messages: localeData.messages,
    },
    cache
  );
}

function getLocaleData(locale: string): LocaleData {
  const supportedLangs = fs
    .readdirSync(`${__dirname}/../../lang/`)
    .map((s) => s.substring(0, 2));
  const localeLang = locale.substring(0, 2);
  const lang = supportedLangs.includes(localeLang) ? localeLang : "en";
  const messages = JSON.parse(
    readFileSync(`${__dirname}/../../lang/${lang}.json`, "utf-8")
  );
  return {
    lang: lang,
    messages: messages,
  };
}

function generateIntlTypes(defaultLang: string) {
  // create source file
  const project = new Project({
    tsConfigFilePath: `${__dirname}/../../tsconfig.json`,
  });
  const sourceFile = project.createSourceFile(`${__dirname}/../../src/lib/lang.ts`, "", { overwrite: true });
  // add lint ignore for file
  sourceFile.addStatements("/* eslint-disable */");
  // import getIntl
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
  // declare IntlMsg object and interface
  const intlMsgInt = sourceFile.addInterface({ name: "IntlMsg" });
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
  // read english strings
  const messages: Record<string, string> = JSON.parse(
    readFileSync(`${__dirname}/../../lang/${defaultLang}.json`, "utf-8")
  );
  // iterate and parse raw english strings
  for (const [id, text] of Object.entries(messages)) {
    // read and parse interface fields
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
    // declare interface if it contains fields; add to IntlMsg interface and obj
    if (args.length > 0) {
      const intName = id + "_Options";
      const messageInt = sourceFile.addInterface({ name: intName });
      for (const arg of args) {
        messageInt.addProperty({ name: arg, type: "any" });
      }
      intlMsgInt.addProperty({ name: id, type: `(options: ${intName}) => string` });
      intlMsgObj.addPropertyAssignment({
        name: id,
        initializer: `(options: ${intName}): string => intl.formatMessage({ id: "${id}", defaultMessage: "${text}" }, options)`,
      });
    } else {
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
