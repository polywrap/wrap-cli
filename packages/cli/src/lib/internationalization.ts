import {
  createIntl,
  createIntlCache,
  IntlShape,
  IntlCache,
} from "@formatjs/intl";
import osLocale from "os-locale";
import { readFileSync } from "fs";
import { MessageFormatElement } from "intl-messageformat-parser";
import * as fs from "fs";

interface LocaleData {
  lang: string;
  messages: Record<string, MessageFormatElement[]>;
}

const cache: IntlCache = createIntlCache();

export function getIntl(locale: string = osLocale.sync()): IntlShape<string> {
  const localeData: LocaleData = getLocaleData(locale);
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
    .readdirSync(`${__dirname}/../../compiled-lang/`)
    .map((s) => s.substring(0, 2));
  const localeLang = locale.substring(0, 2);
  const lang = supportedLangs.includes(localeLang) ? localeLang : "en";
  const messages = JSON.parse(
    readFileSync(`${__dirname}/../../compiled-lang/${lang}.json`, "utf-8")
  );
  return {
    lang: lang,
    messages: messages,
  };
}
