import {
  createIntl,
  createIntlCache,
  IntlShape,
  IntlCache,
} from "@formatjs/intl";
import { MessageFormatElement } from "intl-messageformat-parser";

const cache: IntlCache = createIntlCache();

export async function getIntl(locale: string): Promise<IntlShape<string>> {
  const messages = await loadLocaleData(locale);
  return createIntl(
    {
      locale: locale,
      defaultLocale: "en",
      messages: messages,
    },
    cache
  );
}

async function loadLocaleData(
  locale: string
): Promise<Record<string, MessageFormatElement[]>> {
  switch (locale) {
    case "es":
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return (await require("../../compiled-lang/es.json")).default;
    default:
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return (await require("../../compiled-lang/en.json")).default;
  }
}
