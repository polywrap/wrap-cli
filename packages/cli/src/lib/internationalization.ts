import {
  createIntl,
  createIntlCache,
  IntlShape,
  IntlCache,
} from "@formatjs/intl";
import osLocale from "os-locale";
import { readFileSync } from "fs";
import { MessageFormatElement } from "intl-messageformat-parser";

const cache: IntlCache = createIntlCache();

export function getIntl(locale: string = osLocale.sync()): IntlShape<string> {
  const messages = getLocaleData(locale);
  return createIntl(
    {
      locale: locale,
      defaultLocale: "en",
      messages: messages,
    },
    cache
  );
}

function getLocaleData(locale: string): Record<string, MessageFormatElement[]> {
  switch (locale.substring(0, 2)) {
    case "es":
      return JSON.parse(
        readFileSync(__dirname + "/../../compiled-lang/es.json", "utf-8")
      );
    default:
      return JSON.parse(
        readFileSync(__dirname + "/../../compiled-lang/en.json", "utf-8")
      );
  }
}
