import { IntlStrings } from "./types";

import {
  createIntl,
  createIntlCache,
  IntlShape,
  IntlCache,
} from "@formatjs/intl";
import osLocale from "os-locale";
import { readFileSync } from "fs";
import * as fs from "fs";

interface LocaleData {
  lang: string;
  messages: IntlStrings;
}

const cache: IntlCache = createIntlCache();

export function getIntl(locale: string = osLocale.sync()): IntlShape<string> {
  const localeData: LocaleData = getLocaleData(locale);
  return createIntl(
    {
      locale: localeData.lang,
      defaultLocale: "en",
      messages: (localeData.messages as unknown) as Record<string, string>,
    },
    cache
  );
}

function getLocaleData(locale: string): LocaleData {
  const supportedLangs = fs
    .readdirSync(`${__dirname}/../../../lang/`)
    .map((s) => s.substring(0, 2));
  const localeLang = locale.substring(0, 2);
  const lang = supportedLangs.includes(localeLang) ? localeLang : "en";
  let messages: IntlStrings;
  try {
    messages = JSON.parse(
      readFileSync(`${__dirname}/../../../lang/${lang}.json`, "utf-8")
    );
  } catch (e) {
    console.log(
      `Language data for locale ${locale} is incomplete or malformed. Using default language instead.`
    );
    messages = JSON.parse(
      readFileSync(`${__dirname}/../../../lang/en.json`, "utf-8")
    );
  }
  return {
    lang: lang,
    messages: messages,
  };
}
