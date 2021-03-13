import {
  createIntl,
  createIntlCache,
  IntlShape,
  IntlCache,
} from "@formatjs/intl";
// import { MessageFormatElement } from "intl-messageformat-parser";

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const enMessages = require("../../compiled-lang/en.json");
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const esMessages = require("../../compiled-lang/es.json");

const cache: IntlCache = createIntlCache();

export function getIntl(locale = "en"): IntlShape<string> {
  const messages = locale == "es" ? esMessages : enMessages;
  return createIntl(
    {
      locale: locale,
      defaultLocale: "en",
      messages: messages,
    },
    cache
  );
}

// TODO: find way to use dynamic import without top-level await statements in command files
// async function loadLocaleData(
//   locale: string
// ): Promise<Record<string, MessageFormatElement[]>> {
//   switch (locale) {
//     case "es":
//       // eslint-disable-next-line @typescript-eslint/no-require-imports
//       return require("../../compiled-lang/es.json");
//     default:
//       // eslint-disable-next-line @typescript-eslint/no-require-imports
//       return require("../../compiled-lang/en.json");
//   }
// }

// used for importing uncompiled messages --> less performant
// async function loadRawLocaleData(locale: string): Promise<Record<string, string>> {
//   switch (locale) {
//     case "es":
//       // eslint-disable-next-line @typescript-eslint/no-require-imports
//       return require("../../lang/es.json");
//     default:
//       const messages: Record<string, string> = {};
//       // eslint-disable-next-line @typescript-eslint/no-require-imports
//       const enImportMessages = await require("../../lang/en.json");
//       Object.keys(enImportMessages).map((key: string) => {
//         messages[key] = enImportMessages[key].defaultMessage;
//       });
//       return messages;
//   }
// }
