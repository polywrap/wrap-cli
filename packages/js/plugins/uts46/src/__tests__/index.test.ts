import { PolywrapClient } from "@polywrap/client-js";
import { uts46Plugin } from "..";
const uts46 = require("idna-uts46-hx/uts46bundle.js");

const textToConvert = "xn-bb-eka.at";

describe("IDNA UTS #46", () => {
  let client: PolywrapClient;

  beforeAll(() => {
    client = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/uts46.polywrap.eth",
          plugin: uts46Plugin({ }),
        },
      ],
    });
  });

  describe("Returned values match the plugin's", () => {
    it("ToAscii matches", async () => {
      const expected = uts46.toAscii(textToConvert);
      const response = await client.query<{ toAscii: string }>({
        uri: "wrap://ens/uts46.polywrap.eth",
        query: `
          query {
            toAscii(value: "${textToConvert}")
          }
        `,
      });

      expect(response.data).toBeDefined();
      expect(response.errors).toBeUndefined();
      expect(response.data?.toAscii).toBe(expected);
    });

    it("ToAscii with options matches", async () => {
      const expected = uts46.toAscii(textToConvert, {
        transitional: false,
        useStd3ASCII: true,
        verifyDnsLength: false,
      });
      const response = uts46.toAscii(textToConvert)

      expect(response).toBe(expected);
    });

    it("ToUnicode matches", async () => {
      const expected = uts46.toUnicode(textToConvert);
      const response = await client.query<{ toUnicode: string }>({
        uri: "wrap://ens/uts46.polywrap.eth",
        query: `
          query {
            toUnicode(value: "${textToConvert}")
          }
        `,
      });

      expect(response.data).toBeDefined();
      expect(response.errors).toBeUndefined();
      expect(response.data?.toUnicode).toBe(expected);
    });

    it("Convert matches", async () => {
      const expected = uts46.convert(textToConvert);
      const response = await client.query<{ convert: string }>({
        uri: "wrap://ens/uts46.polywrap.eth",
        query: `
          query {
            convert(value: "${textToConvert}")
          }
        `,
      });

      expect(response.data).toBeDefined();
      expect(response.errors).toBeUndefined();
      expect(response.data?.convert).toEqual(expected);
    });
  });
});
